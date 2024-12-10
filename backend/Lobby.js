import Game from "./Game.js";
import {removePlayer} from "./start.js";


export default class Lobby {
    static lobbyList = {};
    activeGame;
    constructor(player) {
        this.host = player;
        this.activeGame = null;
        player.joinLobby(this);

	    // Contains Player objects
        this.playerList = [player];
        this.inactivePlayers = [];

        this.roomCode = this.generateLobbyCode();
        Lobby.lobbyList[this.roomCode] = this;
        // setInterval(this.sweepPlayers, 600000);
        this.host.on('setupGame', () => {this.startGame()});
    }


	allSockets() {
		return this.playerList.map(p => p.socket).filter(s => !!s);
	}


    playerJoin(player) {
        if (this.playerList.length < 8) {
            this.playerList.push(player);
            player.joinLobby(this);
        this.playerList.forEach(p => p.emit("join", player.id, player.name));
        return true;
        }
        return false;
    }


	playerLeaves(playerId)
	{
    this.playerList.forEach(p => p.emit("left", playerId));
		let listWithOut = this.playerList.map(p => p.id).filter(id => id !== playerId).map(id => this.playerList[id]);
		this.playerList = listWithOut;
	}


    playerDisconnects(playerId) {
        for (const p of this.playerList) {
            if (playerId === p.id) {
                this.inactivePlayers.push(p);
                return;
            }
        }
    }


    kickPlayer(playerId) {
        if (playerId in this.playerList.map(p => p.id)) {
            this.playerLeaves(playerId);
            return true;
        }
        return false;
    }


    sweepPlayers() {
        if (this.activeGame)
            return;
        if (this.inactivePlayers.length !== 0)
        this.inactivePlayers.forEach(p => this.kickPlayer(p.id));
    }


    //sets the host of the lobby
    setHost(player) {
        this.host = player;
    }


    //starts the game (currently pseudocode)
    startGame() {
        //if isReady in playerList is all true, prompt host to start game
        if (this.playerList.every(player => player.isReady === true)) {
            this.activeGame = new Game(this);
            this.activeGame.emitAllPlayer('game');
            this.host.on('gameStart', () => this.activeGame.gameLoop());
        } else
            console.log("Players not all ready");
        //integrate with front end
    }


    generateLobbyCode() {
        let lobbyCode = Math.floor(Math.random() * 655536).toString(16); 
        //generates unique lobby code
        while (Object.keys(Lobby.lobbyList).includes(lobbyCode)) {
            lobbyCode = Math.floor(Math.random() * 65535).toString(16);
        }
        return lobbyCode;
    }


    //function to start the timer, returns function to turn off
    startTimer(startTimeInMinutes) {

        //turns the minutes into countable seconds
        let timeInSeconds = startTimeInMinutes * 60;

        //a bit sloppy, but decrements the count by 1 second and stops when reaches 0
        const interval = setInterval(() => {
            this.updateTimer(timeInSeconds);
            timeInSeconds--

            if (timeInSeconds < 0) {
                clearInterval(interval);
            }
        }, 1000);
        return () => clearInterval(interval);
    }


    //function to update the timer display
    updateTimer(timeInSeconds) {
        const minutes = Math.floor(timeInSeconds / 60).toString();
        let seconds = timeInSeconds % 60;
    
        seconds = seconds < 10 ? "0" + seconds : seconds.toString();

        this.playerList.forEach(p => {
            if ( !(p in this.inactivePlayers) )
                p.emit("time", minutes, seconds);
        })

        // countdownElement.innerHTML = `${minutes}: ${seconds}`;
    }


    close() {

        this.playerList.forEach(p => {
          removePlayer(p.id);
        });

        delete Lobby.lobbyList[this.roomCode];
        this.host = null;
        this.playerList = null;
        this.roomCode = null;
        this.inactivePlayers = null;
        clearInterval(this.sweepPlayers);
    }
}
