import {socket} from "../intitateConnection";
import * as React from "react";
import {memo, useState, useEffect} from "react";
import Game from "./Game";


//
//These get called everytime someone joins/leaves the lobby
//Need to be implemented in backend/Lobby.js
//

const Lobby = memo(function({roomCode, players, setState}){
	const [activePlayers, setPlayers] = useState(players);
	const [game, setGame] = useState(false);
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
		socket.on('gameStart', () => {
			setGame(true);
		})
	}, [setPlayers, setState]);


	if (game) {
		return <Game players={activePlayers} unload={() => setGame(true)}/>
	}

    return (<div className={"block"}>
	    <p>{test}</p>
        <p>Room Code: {roomCode}</p>

        {Object.values(activePlayers).map(playerName => <p>{playerName}</p>)}
	    <button onClick={() => setGame(true)}>Start Game</button>
    </div>);
});

export default Lobby;
