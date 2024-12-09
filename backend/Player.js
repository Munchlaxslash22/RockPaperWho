export default class Player {

    constructor(id) {
        this.name = "";
        this.id = id;
        this.prompt = "";
        this.isReady = false;
		this.lobby = null;
        this.socket = null;
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
        if (this.lobby){
            this.lobby.playerDisconnects(this.id);
        }
    }

    connect(socket) {
        this.socket = socket;

        socket.emit('setup', this.id);

        //TEST
        socket.on('test', () => {
            for (let i = 0; i < 7; i++) {
                let player = new Player(i);
                player.name = "test" + i;
                this.lobby.playerJoin(player);
            }
            this.lobby.playerList.forEach(p => p.readyUp());
        })

        socket.on('ready', () => {
            this.readyUp();
        });
        socket.on('unready', () => {
            this.readyDown();
        });

        socket.on('disconnect', () => {
            this.disconnect();
            socket.removeAllListeners();
        })
    }

	joinLobby(lobby){
        //This player is participating in the game
		this.lobby = lobby;
    }

    leaveLobby(){
        //This player is leaving a game
		this.lobby = null;
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
