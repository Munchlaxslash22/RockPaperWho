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
        this.currentSocket = socket;
    }

    disconnect() {
        this.currentSocket = null;
    }

    joinGame(roomId){
        //This player is participating in the game

    }

    leaveGame(){
        //This player is leaving a game

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