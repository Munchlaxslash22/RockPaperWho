import {socket} from "../intitateConnection";
import * as React from "react";
import {memo, useReducer} from "react";

socket.on('join', (player) => {
    listPlayers[player.id] = player;
    update();
});
socket.on('exit', ({id}) => {
    delete this.listPlayers[id];
    update();
});
const listPlayers = {};
let update;
const Lobby = memo(function({id}){
    update = useReducer((x) => x + 1, 0, () => 0);

    return (<div>
        <p>Lobby ID: {id}</p>

        {Object.values(listPlayers).map(player => {
            return <p key={player.id}>{player.name}</p>
        })}
    </div>);
});

export default Lobby;