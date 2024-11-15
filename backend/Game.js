class Game {
    constructor(roomCode) {
        this.playerLobby = new Lobby(roomCode);
        this.redTeamPrompt = null;
        this.blueTeamPrompt = null;
        this.gameRound = 0;
        this.gameEnd = 0;         //This is the round that the game ends.
        this.pageIndex = 0;       //This is the current webpage being displayed
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

    goBackToLobby() {

    }

    gameLoop(){
        // Prompt every individual in the collection of players for their "answer"
        this.playerLobby.playerList.forEach(Player => {
            // Prompt for responses
            let recievedPrompt = ""; //somefunction
            // Set responces
            Player.prompt(recievedPrompt);
        });

        // Loop for each pair
        this.playerLobby.playerList.forEach(Player => {

            // Players access chat

            // Show off each pair
            for (let i = 0; i < this.playerLobby.playerList.length; i += 2) {
                const player1 = this.playerLobby.playerList[i];
                const player2 = this.playerLobby.playerList[i + 1] || null;

                // Players vote who wins
                if (player2) {
                    // Display both players' prompts and allow voting
                    this.promptForVotes(player1, player2); // Replace with actual vote function
                }
                //player who wins(has more votes for current set) goes to next round
                let turnWinner = this.calculateTurnWinner();
                //Reset # of votes player has

            }
            // Loop until 1 player remains

        })
        // Final player declared winner

        // Prompt for another round, if so restart game loop

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