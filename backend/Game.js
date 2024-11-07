class Game {
    constructor() {
        this.redTeamPrompt = null;
        this.blueTeamPrompt = null;
        this.gameRound = 0;
        this.gameEnd = 0;         //This is the round that the game ends.
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
}
