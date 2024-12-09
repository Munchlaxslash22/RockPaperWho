
function openChat() {
    //Doesn't do anything yet, but meant to open up the chat menu so that players can speak with eachother

}

export default class Game {

    constructor(lobby) {
        this.lobby = lobby;
        console.log(this);
        console.log("Game created by lobby " + this.lobby.roomCode);
    }


    async promptForPrompt() {
        let count = 1;
        await new Promise((resolve) => {
            this.emitAllPlayer("prompt");
            console.log("emit prompt");
            this.onAllPlayer("editPrompt", () => {
                count--;
            });
            this.onAllPlayer("prompt", (p, prompt) => {
                p.prompt = prompt;
                count++;
                if (count === this.lobby.playerList.length)
                    resolve();
            });
            this.lobby.host.on('breakPrompts', () => {
                resolve();
            });
        });
        this.removeAllEvents("prompt", "breakPrompts","editPrompt")
    }


    async promptForVotes(idOrder) {

        let count = 1;
        let result = await new Promise((resolve) => {
            const result  ={};
            this.emitAllPlayer("startVote");
            this.onAllPlayer("vote", (p, v) => {
                if (v !== 1 && v !== 2)
                    return;
                let index = idOrder.indexOf(p.id);
                if (index === -1)
                    return;
                this.emitAllPlayer("vote", p.id, v);
                result[index] = v;
                if (count === idOrder.length)
                    resolve(result);
                count++;
            });
            this.lobby.host.on('breakRound', () => {
                resolve(result);
            })
        })
        this.removeAllEvents("vote", "breakRound");
        return Object.values(result); //array of player ids by voted
    }

    async gameLoop(){
        // Prompt every individual in the collection of players for their "answer"
        // Shuffle the players so they are in a random order
        let playerList = this.lobby.playerList.randomize();
        let idList = playerList.map(p => p.id);

        this.onAllPlayer('chat', (p, msg) => this.emitAllPlayer('chat', msg, p.id));
        await this.promptForPrompt();
        let tempWinner = playerList[0];
        for (let i = 1; i < playerList.length; i++) { //this loop intentionally runs one shorter
                                                                            //than typical!!
            let blueLeader = tempWinner;
            let redLeader = playerList[i];
            let blueVoters = [blueLeader];
            let redVoters = [redLeader];
            this.lobby.startTimer(3);
            let votesByIndex = await this.promptForVotes(idList);
            for (let i = 0; i<votesByIndex.length; i++) {
                if (votesByIndex[i] === 1)
                    blueVoters.push(playerList[i]);
                else if (votesByIndex[i] === 2)
                    redVoters.push(playerList[i]);
            }
            if (blueVoters.length === redVoters.length) {
                // tie breaker round!
                blueVoters = [blueLeader];
                redVoters = [redLeader];
                // let everyone know this is a tie breaker!
                votesByIndex = await this.promptForVotes(idList);
                for (let i = 0; i<votesByIndex.length; i++) {
                    if (votesByIndex[i] === 1)
                        blueVoters.push(playerList[i]);
                    else if (votesByIndex[i] === 2)
                        redVoters.push(playerList[i]);
                }
                // if it's a tie again, then we pick randomly
                if (blueVoters.length === redVoters.length) {
                    if (Math.floor(Math.random() * 2) === 1) {
                        //handling red team winning
                        tempWinner = redLeader;

                }
            }
            if (redVoters.length > blueVoters.length) {
                //handling red team winning
                tempWinner = redLeader;
            }

            } //theres more for both of those above handles, but this is the framework for a game

            // eslint-disable-next-line no-loop-func
            this.emitAllPlayer('roundEnd', tempWinner.id);
            //theres more for both of those above handles, but this is the framework for a game
        }
        this.emitAllPlayer('gameEnd', tempWinner.id, this.lobby.host.id);
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
            this.lobby.playerList.forEach(p => p.socket.removeListener(e));
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

function randomize(){
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
Array.prototype.randomize = randomize;
