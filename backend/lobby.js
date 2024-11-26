export default class Lobby{
    static lobbyList = {};
    lobbySockets;

    constructor(roomCode) {
        this.host = null;
        this.playerList = [];
        this.roomCode = roomCode;
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
        // start game
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

    //function to start the timer
    startTimer(startTimeInMinutes) {

    //turns the minutes into countable seconds
    let timeInSeconds = startTimeInMinutes * 60;
    
    //set the id of the paragraph in html, example is "timer"
    const countdownElement = document.getElementById('timer');
    
    //a bit sloppy, but decrements the count by 1 second and stops when reaches 0
    const interval = setInterval(function(){updateTimer(timeInSeconds,countdownElement); 
    
        timeInSeconds--
        
        if(timeInSeconds < 0){
            clearInterval(interval);
            }
        }, 1000);
    }
    //function to update the timer display
    updateTimer(timeInSeconds, countdownElement) {
        const minutes = Math.floor(timeInSeconds / 60);
        let seconds = timeInSeconds % 60;
    
        seconds = seconds < 10 ? "0" + seconds : seconds;
    
            seconds = seconds;
    
        countdownElement.innerHTML = `${minutes}: ${seconds}`;
    }

}