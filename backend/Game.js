
function openChat() {
    //Doesn't do anything yet, but meant to open up the chat menu so that players can speak with eachother

}

export default class Game {
    gamePlayers = {};
    playerPrompts

    constructor(lobby) {
        this.lobby = lobby;
        this.lobby.playerList.forEach(p => p.socket.on('chat', (msg) => {
            this.lobby.playerList.forEach(p2 => p2.socket.emit('chat', msg));
        }))
        this.gameLoop();
    }


    join(player) {
        player.socket.on('chat', (msg) => {
            this.lobby.playerList.forEach(p => p !== player ? p.socket.emit('chat', msg, this.gamePlayers[player.id].name) : false);
        })

        this.gamePlayers[player.id] = player;
    }


    async promptForPrompt() {
        const pIDs =[];
        const pPrompts = [];
        return (await new Promise((resolve) => {
            this.lobby.playerList.forEach(p => p.socket.emit("prompt"));
            this.lobby.playerList.forEach(p => p.socket.on("prompt", (prompt) => {
                pIDs.push(p.id);
                pPrompts.push(prompt);

                if (pIDs.length >= this.lobby.playerList.length) {
                    resolve(pIDs.reduce((accumulator, id, index) => {
                        return {...accumulator, [id]: pPrompts[index]};
                    }, {}));
                }
            }))
        }));
    }


    async promptForVotes(idOrder) {
        let count = 1;
        let result = await new Promise((resolve) => {
            const result = {};
            this.lobby.playerList.forEach(p => p.socket.emit("vote"));
            this.lobby.playerList.forEach(p => p.socket.on("vote", (v) => {
                if (v !== 1 && v !== 2)
                    return;
                p.socket.emit("voteConfirm");
                let index = idOrder.indexOf(p.id);
                result[index] = v;
                if (count == idOrder.length)
                    resolve(result);
                count++;
            }))
        })
        return Object.values(result); //array of player ids by voted
    }


    get playerList () {
        return Object.values(this.gamePlayers);
    }


    gameLoop(){
        // Prompt every individual in the collection of players for their "answer"

        // Shuffle the players so they are in a random order
        let playerList = this.lobby.playerList.randomize();

        let tempWinner = playerList[0];
        for (let i = 1; i < playerList.length; i++) { //this loop intentionally runs one shorter
                                                                            //than typical!!
            let blueLeader = tempWinner;
            let redLeader = playerList[i];
            let blueVoters = [blueLeader];
            let redVoters = [redLeader];
            openChat(); //<- doesn't exist, but basically this is when we want players to be able to start discussing
            this.lobby.startTimer(3);
            let votesByIndex = this.promptForVotes(playerList.map(p => p.id));
            for (let i = 0; i<votesByIndex.length; i++) {
                if (votesByIndex[i] === 1)
                    blueVoters.push(this.playerLobby.playerList[i]);
                else if (votesByIndex[i] === 2)
                    redVoters.push(this.playerLobby.playerList[i]);
            }
            if (blueVoters.length === redVoters.length) {
                // tie breaker round!
                blueVoters = [blueLeader];
                redVoters = [redLeader];
                // let everyone know this is a tie breaker!
                this.promptForVotes();
                // if it's a tie again, then we pick randomly
                if (blueVoters.length === redVoters.length) {
                    if (Math.floor(Math.random() * 2) === 1) {
                        //handling red team winning
                        tempWinner = redLeader;
                    } else {
                        //handling blue team winning

                    }

                }
            }
            if (redVoters.length > blueVoters.length) {
                //handling red team winning
                tempWinner = redLeader;
            } else {
                //handling blue team winning

            } //theres more for both of those above handles, but this is the framework for a game

        }
        if (prompt('Drop in a y if you\'d like to play again')=='y'){
            this.gameLoop();
        }
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

Array.prototype.randomize = randomize;
