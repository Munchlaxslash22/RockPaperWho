import {socket, clientID} from "../intitateConnection";
import * as React from "react";
import {memo, useReducer} from "react";


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
export const listPlayers = {
    clientId : {
        name: "test"
    }
};
let update;
const Lobby = memo(function({id}){
    update = useReducer((x) => x + 1, 0, () => 0);

    return (<div>
        <p>Lobby ID: {id}</p>

        {Object.values(listPlayers).map(player => {
            return <p>{player.name}</p>
        })}
    </div>);
});

export default Lobby;