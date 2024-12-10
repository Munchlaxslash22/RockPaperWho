import fs from "fs";

// eslint-disable-next-line no-extend-native
Array.prototype.randomize = function (){
    let temp = this.slice();
    let final = [];
    for (let i = 0; i < this.length; i++){
        const r = Math.random() * temp.length;
        const y = Math.floor(r)
        let x = temp[y];
        final.push(x);
        temp =  temp.filter((p) => p !== x);
    }
    return final;
}

// eslint-disable-next-line no-extend-native
Array.prototype.random = function () {
    return this[Math.floor(Math.random() * this.length)];
}

let randomPrompts = fs.readFileSync('./backend/randomAnswers.txt', {encoding: "utf-8"}).split('\n').randomize();

export default class Game {

    constructor(lobby) {
        this.lobby = lobby;
        console.log(this);
        console.log("Game created by lobby " + this.lobby.roomCode);
    }



    openChat() {
        this.onAllPlayer('chat', (p, msg) => this.emitAllPlayer('chat', msg, p.id));
        return () => this.removeAllEvents('chat');
    }

    async promptForPrompt() {
        await new Promise((resolve) => {
            const breakPrompts = () => {
                this.lobby.playerList.forEach(p => {
                    if (!p.prompt) {
                        p.prompt = randomPrompts.random();
                    }});
                clearTimeout(x);
                resolve()
            };
            let x = setTimeout(breakPrompts, 60000);

            this.emitAllPlayer("prompt");
            console.log("emit prompt");
            this.onAllPlayer("prompt", (p, prompt) => {
                p.prompt = prompt;
                if (this.lobby.playerList.every(p => !!p.prompt))
                    clearTimeout(x);
                    resolve();
            });
                this.lobby.host.on('breakPrompts', breakPrompts)
        });
        this.removeAllEvents("prompt", "breakPrompts","editPrompt")
    }


    async promptForVotes(players, endTimer) {
        let [blue, red] = await new Promise((resolve) => {
            let bArr = [];
            let rArr = [];
            this.emitAllPlayer("startVote");
            this.onAllPlayer("vote", (p, v) => {
                console.log(bArr.includes(p));
                if (v !== 1 && v !== 2)
                    return;
                console.log(`${p.name} voted for ${v === 1 ? "blue" : "red"}`);
                this.emitAllPlayer("vote", p.id, v);
                if (v === 1) {
                    if (!bArr.includes(p)) {
                        bArr.push(p);
                        if (rArr.includes(p))
                            rArr = rArr.filter(pl => p !== pl);
                    }
                } else if (v === 2) {
                    if (!rArr.includes(p)) {
                        rArr.push(p);
                        if (bArr.includes(p))
                            bArr = bArr.filter(pl => p != pl);
                    }
                }

                if (players.every(p => (rArr.includes(p)) || (bArr.includes(p)))) {
                    endTimer();
                    resolve([bArr, rArr]);
                }
            });
            this.lobby.host.on('breakRound', () => {
                endTimer();
                resolve([bArr, rArr]);
            })
            this.lobby.host.on('timerOut', () => {
                resolve([bArr, rArr]);
            })
        })
        this.removeAllEvents("vote","timerOut", "breakRound");
        return [blue, red]; //array of player ids by voted
    }

    async gameLoop(){
        // Prompt every individual in the collection of players for their "answer"
        // Shuffle the players so they are in a random order
        let playerList = this.lobby.playerList.randomize();

        await this.promptForPrompt();
        const closeChat = this.openChat();
        let tempWinner = playerList[0];
        let losingPrompt = "";
        for (let i = 1; i < playerList.length; i++) { //this loop intentionally runs one shorter
                                                                            //than typical!!
            let blueLeader = tempWinner;
            let redLeader = playerList[i];
            let blueVoters = [];
            let redVoters = [];
            this.emitAllPlayer('round', blueLeader.prompt, redLeader.prompt);
            let endTimer = this.lobby.startTimer(3);
            [blueVoters, redVoters] = await this.promptForVotes(playerList, endTimer);
            console.log("Voted blue: " + blueVoters.map(p => p.name).toString(), "Voted red: " +redVoters.map(p => p.name).toString());
            console.log("Tie breaker? " + (blueVoters.length === redVoters.length));
            if (blueVoters.length === redVoters.length) {
                // tie breaker round!
                blueVoters = [];
                redVoters = [];
                // let everyone know this is a tie breaker!
                this.emitAllPlayer('tie');
                let tieTimer = this.lobby.startTimer(1);
                [blueVoters, redVoters] = await this.promptForVotes(playerList, tieTimer);
                // if it's a tie again, then we pick randomly
                if (blueVoters.length === redVoters.length) {
                    if (Math.floor(Math.random() * 2) === 1) {
                        //handling red team winning
                        tempWinner = redLeader;
                        losingPrompt = blueLeader.prompt;
                    } else
                        losingPrompt = redLeader.prompt;
                }
            }
            if (redVoters.length > blueVoters.length) {
                //handling red team winning
                tempWinner = redLeader;
                losingPrompt = blueLeader.prompt;
            } else
                losingPrompt = redLeader.prompt;
            //theres more for both of those above handles, but this is the framework for a game

            // eslint-disable-next-line no-loop-func
            this.emitAllPlayer('roundEnd', tempWinner.id);
            this.emitAllPlayer('resetChat');
            //theres more for both of those above handles, but this is the framework for a game
        }
        closeChat();
        this.emitAllPlayer('gameEnd', tempWinner.id, this.lobby.host.id, tempWinner.prompt, losingPrompt);
        this.lobby.host.on('replay', (bool) => {
            if (bool) {
                this.gameLoop();
            }
        })
    }

    // f = (p) => return [...args]
    emitAllPlayer(msg, ...f) {
        if (f[0] instanceof Function)
            this.lobby.playerList.forEach(p => p.emit(msg, ...(f[0](p))));
        else
            this.lobby.playerList.forEach(p => p.emit(msg, ...f));
    }

    // f = (player, ...args)
    onAllPlayer(msg, f) {
        this.lobby.playerList.forEach(p => p.on(msg, (...args) => f(p, ...args)));
    }

    removeAllEvents(...ev) {
        ev.forEach(e => {
            this.lobby.playerList.forEach(p => p.removeEvents(e));
        })
    }

}


export function prompt(msg) {
    return new Promise((resolve) => {

        console.log(msg);

        let stdin = process.stdin;

        // without this, we would only get streams once enter is pressed
        stdin.setRawMode(true);

        // resume stdin in the parent process (node app won't quit all by itself
        // unless an error or process.exit() happens)
        stdin.resume();

        // i don't want binary, do you?
        // na, but ASCII might be funny
        stdin.setEncoding('utf8');

        let str = '';
        // on any data into stdin
        stdin.on('data', function getInfo(key) {

            // ctrl-c ( end of text )
            if (key === '\u0003') {
                process.exit();
            }

            if (key === '\b') {
                let s = str.split('');
                s.pop();
                str = s.join('');
            } else if (key === '\r') {
                stdin.removeAllListeners();
                stdin.pause();
                console.clear();
                resolve(str);
            } else {
                str += key;
            }


            // write the key to stdout all normal like
            console.clear();
            console.log(str);
        });
    })
}





