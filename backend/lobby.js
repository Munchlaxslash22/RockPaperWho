import Game from "./Game.js"

export default class Lobby{
    static lobbyList = {};
    lobbySockets;

    constructor(roomCode) {
        this.host = null;
        this.playerList = [];
        this.roomCode = this.generateLobbyCode();
    }

    //Enter players into the array
    setplayerIndex(player, index){
        if(index > 8)
            console.log("Not a valid index");

        this.playerList[index] = player;
    }

    //sets the host of the lobby
    setHost(player){
        this.host = player;
    }

    //starts the game (currently pseudocode)
    startGame(playerList, host) {
        //if isReady in playerlist is all true, prompt host to start game
        if(playerList.every(player => player.isReady === true)){
            let activeGame = new Game(this);
            activeGame.gameLoop();
        }
        else
        console.log("Players not all ready");
        //integrate with front end
    }

    generateLobbyCode(){
        let lobbyCode = Math.floor(Math.random() * (99999999 - 10000000)) + 10000000;
        //generates unique lobby code
        while(Object.keys(Lobby.lobbyList).includes(lobbyCode)) {
            lobbyCode = Math.floor(Math.random() * (99999999 - 10000000)) + 10000000;
        }
        return lobbyCode;
    }

}