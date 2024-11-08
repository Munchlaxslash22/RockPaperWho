class Player {

    constructor() {
        this.name = "";
        this.playerID = "";
        this.isHost = false;
        this.prompt = "";
        this.vote = null;
        this.isReady = false;
        this.isOut = false;
    }

    constructor(name, playerID, isHost){
        this.name = name;
        this.playerID = playerID;
        this.isHost = isHost;
        this.prompt = "";
        this.vote = null;
        this.isReady = false;
        this.isOut = false;
    }

    set prompt(myPrompt){
        this.prompt = myPrompt;
    }

    set vote(myVote){
        this.vote = myVote;
    }

    set isOut(knockedOut){
        this.isOut = knockedOut;
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