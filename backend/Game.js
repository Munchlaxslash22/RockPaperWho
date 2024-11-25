import Lobby from "./lobby.js"
import {players} from "./start.js";

function openChat() {
    //Doesnt do anything yet, but meant to open up the chat menu so that players can speak with eachother
}

export default class Game {
    gamePlayers = {};
    playerLobby;

    constructor(lobby) {
        this.playerLobby = lobby;
        this.redTeamPrompt = null;
        this.blueTeamPrompt = null;
        this.gameRound = 0;
        this.gameEnd = 0;         //This is the round that the game ends.
        this.pageIndex = 0;       //This is the current webpage being displayed
    }



    join(socket) {
        if (Object.keys(this.gamePlayers).includes(socket.id))
            socket.on('chat', (msg) => {
                Object.values(this.playerLobby.lobbyList).forEach(s => s.emit('chat', msg, this.gamePlayers[socket.id].name));
            })
    }

    set pageIndex(index) {
        this.pageIndex = index;
    }

    promptForVotes(player1, player2) {
        // Display player prompts to the console
        console.log(`1. ${player1.name}'s prompt: ${player1.prompt}`);
        console.log(`2. ${player2.name}'s prompt: ${player2.prompt}`);

        // Prompt the user for their vote
        let vote = prompt(`Who do you vote for? Enter 1 for ${player1.name} or 2 for ${player2.name}:`);

        // Simple vote counting logic
        if (vote === '1') {
            player1.voteCount = (player1.voteCount) + 1;
        } else if (vote === '2') {
            player2.voteCount = (player2.voteCount) + 1;
        } else {
            console.log("Invalid vote. Please enter 1 or 2.");
            // Optionally, you could recall this function to prompt again:
            // promptForVotes(player1, player2);
        }
    }

    clearAllPrompts() {
        this.redTeamPrompt = null;
        this.blueTeamPrompt = null;
    }

    clearTeams() {
        //Sets vote in the Player class to null.
        this.playerLobby.playerList.forEach(player => {
            player.vote = null;
        });
    }

    calculateTurnWinner() {
        //We need to add something to count wins for each player.

        let maxVotes = 0;
        let winner = null;

        //Cycles through each player's # of votes
        this.playerLobby.playerList.forEach(player => {
            if (player.voteCount > maxVotes) {
                maxVotes = player.voteCount;    //Stores # of votes if > previous player
                winner = player;                //and stores player
            }
        });

        return winner;
    }

    get playerList () {
        return Object.values(this.gamePlayers);
    }

    goBackToLobby() {

    }

    gameLoop(){
        // Prompt every individual in the collection of players for their "answer"

        // Shuffle the players so they are in a random order

        let playerList = this.playerList;
        let tempWinner = playerList[0];
        for (let i = 1; i < playerList.length-1; i++) { //this loop intentionally runs one shorter
                                                                            //than typical!!
            let blueLeader = tempWinner;
            let redLeader = playerList[i];
            let blueVoters = [blueLeader];
            let redVoters = [redLeader];
            openChat(); //<- doesn't exist, but basically this is when we want players to be able to start discussing
            // 3:00 minute wait!
            this.promptForVotes(); //<- not sure how to retrieve votes from this, but this function need rewriting so
            if (blueVoters.length === redVoters.length) {
                // tie breaker round!
                blueVoters = [blueLeader];
                redVoters = [redLeader];
                this.clearTeams();
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
