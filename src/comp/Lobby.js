import {clientID, socket} from "../intitateConnection";
import * as React from "react";
import {memo, useState, useEffect} from "react";
import Game from "./Game";


//
//These get called everytime someone joins/leaves the lobby
//Need to be implemented in backend/Lobby.js

let props = {};
function alternate(f, f2) {
let bool = true;
	return () => {
	if (bool)
		f()
	else
		f2()

	bool = !bool;
	}
}

const Lobby = memo(function({roomCode, players, setState, isHost}){
	const [activePlayers, setPlayers] = useState(players);
	const [game, setGame] = useState(false);
	const [win, setWin] = useState(false);
	const [ready, setReady] = useState("ready up");
	useEffect(() => {
		socket.on('join', (id, name) => {
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
	}, [setPlayers, setState, setGame]);


	function restart () {
		setWin(false);
		setGame(true);
	}

	function unload(winnerID, hostID, winningPrompt, losingPrompts) {
		setGame(false);

		props = {
			restart: restart,
			winnerName: activePlayers[winnerID],
			winningPrompt,
			losingPrompts,
			hostID
		}

		setWin(true);
	}

	if (win) {
		return <Win {...props} /> 
	}


	if (game) {
		return <Game players={activePlayers} unload={unload}/>
	}

	function setupGame() {
		socket.emit('setupGame');
	}


    return (<div className={"block"}>
		<button onClick={() => socket.emit('test')}>test button</button>
        <p>Room Code: {roomCode.toUpperCase()}</p>

			{Object.values(activePlayers).map(playerName => <p>{playerName}</p>)}
			<button onClick={alternate(() => {
				socket.emit("ready");
				setReady('unready');
			}, () => {
				socket.emit("unready");
				setReady('ready up');
			})}>{ready.toUpperCase()}</button>
			{isHost ? <button onClick={setupGame}>Start Game</button> : ""}
    </div>);
});

function Win ({winningPrompt, restart, winnerName, hostID, losingPrompts}) {

    return (
			<>
				<div style={{width: "40vw"}}>
				{clientID === hostID ? <div className="block">
					<button onClick={restart}>Restart?</button>
				</div> : ""}
					<div className="block" >
            <div>The winner is {winnerName}</div>
            <p style={{
								textAlign: "center",
								fontSize: 50
							}}>{winningPrompt.toUpperCase()}</p>
        </div>
				</div>
					<div className="block" style={{
							position: "absolute",
							maxWidth: "20vw",
							left: "70vw"
					}}>Won against: <br/>{losingPrompts.map(p => <p>{p}</p>)}</div>
			</>
    )
}

export default Lobby;
