export default class Player {

    constructor(id, socket) {
        this.name = "";
        this.id = id;
        this.prompt = "";
        this.isReady = false;
		this.lobby = undefined;
        this.socket = socket;
    }

    emit(msg, ...arg) {
        if (this.socket) {
            this.socket.emit(msg, ...arg);
        }
    }

    on(msg, func) {
        if (this.socket) {
            this.socket.on(msg, func);
        }
    }

    removeEvents(msg){
        if (this.socket) {
            this.socket.removeAllListeners(msg);
        }
    }

    disconnect(id) {
        this.socket = null;
    }

    reconnect(socket) {
        this.socket = socket;
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
