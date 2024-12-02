import {memo, useEffect, useState} from "react";
import Chat from "./Chat";
import {socket} from "../intitateConnection";
import "./Game.css";



const Game = memo(({lobby, players}) => {
    const [visibility, revealPrompt] = useState("none");
    useEffect(() => {
        socket.on('prompt', () => {

        })
    });


    return (
        <div id={"gameWrapper"}>
            <div style={{display: visibility}}>
                <Prompt />
            </div>
            <div>
                <Timer/>
            <Chat lobby={lobby} players={players}/>
            </div>
            <Leaderboard/>
        </div>
    )
});

function Prompt() {
    return <p>Prompt</p>;
}

function Timer() {
    return <p>Timer</p>;
}

function Leaderboard() {
    return <p>Leaderboard</p>;
}

export default Game;