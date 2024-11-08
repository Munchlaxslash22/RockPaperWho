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

    clearAllPrompts() {
        this.redTeamPrompt = null;
        this.blueTeamPrompt = null;
    }

    clearTeams() {
        //I believe this sets vote in the Player class to null.
        
    }

    calculateWinner() {
        //We need to add something to count wins for each player.
    }

    goBackToLobby() {

    }

    gameLoop(){
        // Prompt every individual in the collection of players for their "answer"

        // Loop for each 2 pairs of players
            // Show off each pair

            // Players access chat

            // Players vote who wins

            // Loop until 1 player remains

        // Final player declared winner

        // Prompt for another round, if so restart game loop

    }
}
