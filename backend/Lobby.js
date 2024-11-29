import Game from "./Game.js"

export default class Lobby {
    static lobbyList = {};

    constructor() {
        this.host = null;
        // Contains Player objects
        this.playerList = [];
        this.inactivePlayers = [];

        this.roomCode = this.generateLobbyCode();
        Lobby.lobbyList[this.roomCode] = this;
        setInterval(this.sweepPlayers, 600000);
    }

    playerJoin(player) {
        if (this.playerList.length < 7) {
            this.playerList.push(player);
            return true;
        }
        return false;
    }

    kickPlayer(playerId) {
        if (this.playerList.includes(playerId)) {
            this.playerList = this.playerList.filter(id => id !== playerId);
            return true;
        }
        return false;
    }

    sweepPlayers() {
        for (const id of this.inactivePlayers) {
            this.kickPlayer(id);
        }
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
        let lobbyCode = Math.floor(Math.random() * (99999999 - 10000000)) + 10000000;
        //generates unique lobby code
        while (Object.keys(Lobby.lobbyList).includes(lobbyCode)) {
            lobbyCode = Math.floor(Math.random() * (99999999 - 10000000)) + 10000000;
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
        delete Lobby.lobbyList[this.roomCode];
        this.host = null;
        this.playerList = null;
        this.roomCode = null;
        this.inactivePlayers = null;
        clearInterval(this.sweepPlayers);
    }
}