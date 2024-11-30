import {socket, clientID} from "../intitateConnection";
import * as React from "react";
import {memo, useState, useEffect} from "react";


//
//These get called everytime someone joins/leaves the lobby
//Need to be implemented in backend/Lobby.js
//

const Lobby = memo(function({roomCode, players}){
	const [activePlayers, setPlayers] = useState(players);
	const [test, setTest] = useState("");
	useEffect(() => {
		socket.on('join', (id, name) => {
			setTest("test");
			setPlayers((pl) => {
				pl[id] = name;
				return pl;
			});
		});
		socket.on('left', (id) => {
			setPlayers((pl) => {
				delete pl[id];
				return pl;
			});
		});
	}, [setPlayers]);


    return (<div>
	    <p>{test}</p>
        <p>Room Code: {roomCode}</p>

        {Object.values(activePlayers).map(playerName => <p>{playerName}</p>)}
	    <button>Start Game</button>
    </div>);
});

export default Lobby;
