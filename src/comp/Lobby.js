import {socket, clientID} from "../intitateConnection";
import * as React from "react";
import {memo, useReducer, useEffect} from "react";


//
//These get called everytime someone joins/leaves the lobby
//Need to be implemented in backend/Lobby.js
//
socket.on('join', (player) => {
    listPlayers[player.id] = player;
    update();
});
socket.on('exit', ({id}) => {
    delete this.listPlayers[id];
    update();
});
let listPlayers;
let update;
const Lobby = memo(function({id, players}){
    update = useReducer((x) => x + 1, 0, () => 0);
	useEffect(() => {
		listPlayers = players;
	}, [players]);

    return (<div>
        <p>Lobby ID: {id}</p>

        {Object.values(listPlayers).map(playerName => <p>{playerName}</p>)}
	    <button>Start Game</button>
    </div>);
});

export default Lobby;
