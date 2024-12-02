import {memo, useEffect, useState} from "react";
import Chat from "./Chat";
import {socket} from "../intitateConnection";
import "./Game.css";



const Game = memo(({players}) => {
    const [visibility, revealPrompt] = useState("none");
    useEffect(() => {
        socket.on('prompt', () => {
            revealPrompt("block");
        })
    });


    return (
        <div id={"gameWrapper"}>
            <Prompt vis={visibility} set={revealPrompt} />
            <div>
                <Timer/>
                <button onClick={() => revealPrompt('block')}>revealPrompt</button>
            <Chat players={players}/>
            </div>
            <Leaderboard/>
        </div>
    )
});

function Prompt({vis, set}) {
    const [text, setText] = useState('');
    return (
        <div style={{
            display: vis,
            backgroundColor: "white",
            border: "black 2px solid",
            borderRadius: "20%",
            position: "absolute",
            height: "20px",
            width: "100px",
            top: "50%",
            left: "50%",
            clipPath: "border-box",
            transform: "translate(-50%, -50%)"
        }}>
            <form style={{
                height: "inherit",
                width: "inherit"
            }} onSubmit={(e) => {
            set("none");
            setText('');
            e.preventDefault();
        }}>
                <input style={{
                    display: "block",
                    height: "100%",
                    width: "100%",
                    padding: "0",
                }} type={"text"} value={text} onChange={(e) => setText(e.target.value)}/>
            </form>
        </div>
            );
}

function Timer() {
    return <p>Timer</p>;
}

function Leaderboard() {
    return <p>Leaderboard</p>;
}

export default Game;