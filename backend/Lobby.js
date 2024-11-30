import Game from "./Game.js";
import {removePlayer} from "./start.js";


export default class Lobby {
    static lobbyList = {};
    constructor(player) {
		this.host = player;
		player.joinLobby(this);


	// Contains Player objects
        this.playerList = [player];
        this.inactivePlayers = [];

        this.roomCode = this.generateLobbyCode();
        Lobby.lobbyList[this.roomCode] = this;
        setInterval(this.sweepPlayers, 600000);
    }

	allSockets() {
		console.log("<player list>");
		console.log(this.playerList);
		return this.playerList.map(p => p.currentSocket);
	}

    playerJoin(player) {
        if (this.playerList.length < 7) {
            this.playerList.push(player);
			this.allSockets().forEach(s => s.emit("join", player.id, player.name));
            return true;
        }
        return false;
    }

	playerLeaves(playerId)
	{
		let listWithOut = this.playerList.map(p => p.id).filter(id => id !== playerId).map(id => this.playerList[id]);
		this.playerList = listWithOut;
	}

    kickPlayer(playerId) {
        if (playerId in this.playerList.map(p => p.id)) {
			this.playerLeaves(playerId);
					this.allSockets().forEach(s => s.emit("left", playerId));
            return true;
        }
        return false;
    }

    sweepPlayers() {
		this.inactivePlayers.forEach(p => this.kickPlayer(p.id));
    }


    //sets the host of the lobby
    setHost(player) {
        this.host = player;
    }

    //starts the game (currently pseudocode)
    startGame(playerList, host) {
        //if isReady in playerlist is all true, prompt host to start game
        if (playerList.every(player => player.isReady === true)) {
            let activeGame = new Game(this);
            activeGame.gameLoop();
        } else
            console.log("Players not all ready");
        //integrate with front end
    }

    generateLobbyCode() {
        let lobbyCode = Math.floor(Math.random() * 655536).toString(16); 
        //generates unique lobby code
        while (Object.keys(Lobby.lobbyList).includes(lobbyCode)) {
            lobbyCode = Math.floor(Math.random() * 655536).toString(16);
        }
        return lobbyCode;
    }

    //function to start the timer
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
    }
    //function to update the timer display
    updateTimer(timeInSeconds) {
        const minutes = Math.floor(timeInSeconds / 60).toString();
        let seconds = timeInSeconds % 60;
    
        seconds = seconds < 10 ? "0" + seconds : seconds.toString();

        this.playerList.forEach(p => {
            p.currentSocket.emit("time", minutes, seconds);
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
