export default class Player {

    constructor(id, socket) {
        this.name = "";
        this.playerID = id;
        this.isHost = false;
        this.prompt = "";
        this.vote = null;
        this.isReady = false;
        this.isOut = false;
        this.voteCount = 0;
		this.lobby = undefined;
        this.currentSocket = socket;
    }

    disconnect(id) {
        this.currentSocket = null;
    }

	joinLobby(lobby){
        //This player is participating in the game
		this.lobby = lobby;
    }

    leaveLobby(){
        //This player is leaving a game
		this.lobby = undefined;
    }

    requestVote(myVote){
        //prompt the player for their vote and then set it

        this.vote(myVote);
    }

    readyUp(){
        //set this player's ready state
        this.isReady = true;
    }
}
