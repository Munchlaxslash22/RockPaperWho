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
				return {...pl, [id] : name};
			});
		});
		socket.on('left', (id) => {
			setPlayers((pl) => {
				delete pl[id];
				return {...pl};
			});
		});
		socket.on('game', () => {
			setGame(true);
		})
		return () => {
			socket.removeEvents("gameStart", "left", "join");
		}
	}, [setPlayers, setState, setGame, setTest]);

	if (game) {
		return <Game players={activePlayers} unload={() => setGame(true)}/>
	}

	function setupGame() {
		socket.emit('setupGame');
	}


    return (<div className={"block"}>
		<button onClick={() => socket.emit('test')}>test button</button>
        <p>Room Code: {roomCode}</p>

        {Object.values(activePlayers).map(playerName => <p key={crypto.randomUUID()}>{playerName}</p>)}
	    <button onClick={setupGame}>Start Game</button>
    </div>);
});

export default Lobby;
