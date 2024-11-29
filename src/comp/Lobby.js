import {socket, clientID} from "../intitateConnection";
import * as React from "react";
import {memo, useState, useEffect} from "react";


//
//These get called everytime someone joins/leaves the lobby
//Need to be implemented in backend/Lobby.js
//

const Lobby = memo(function({roomCode, players}){
	const [activePlayers, setPlayers] = useState(players);
	useEffect(() => {
		socket.on('join', (id, name) => {
			setPlayers((pl) => {
				pl[id] = name;
				return pl;
			});
		});
		socket.on('exit', (id) => {
			setPlayers((pl) => {
				delete pl[id];
				return pl;
			});
		});
	}, [players]);

    return (<div>
        <p>Room Code: {roomCode}</p>

        {Object.values(activePlayers).map(playerName => <p>{playerName}</p>)}
	    <button>Start Game</button>
    </div>);
});

export default Lobby;
