export default class Player {

    constructor(id, socket) {
        this.name = "";
        this.id = id;
        this.prompt = "";
        this.isReady = false;
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
		delete this.lobby
    }

    readyUp(){
        //set this player's ready state
        this.isReady = true;
    }

    readyDown(){
        //reset this player's ready state
        this.isReady = false;
    }
}
