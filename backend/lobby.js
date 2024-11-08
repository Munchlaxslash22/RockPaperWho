class Lobby{
    constructor(roomCode) {
        this.host = null;
        this.playerList = [];
        this.roomCode = roomCode;
    }

    //Enter players into the array
    setplayerIndex(player, index){
        this.playerList[index] = player;
    }

    //sets the host of the lobby
    setHost(player){
        this.host = player;
    }

    //starts the game (currently pseudocode)
    startGame(playerList, host) {
        //if isReady in playerlist is all true, promp host to start game
        // else, not all players are ready
    }

}