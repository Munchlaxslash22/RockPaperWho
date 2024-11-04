class Game {
    constructor() {
        this.redTeamPrompt = null;
        this.blueTeamPrompt = null;
        this.gameRound = 0;
        this.gameEnd = false;         //This was an int in the diagram, but it makes more sense as a boolean
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