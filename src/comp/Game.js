import {memo, useEffect, useState} from "react";
import Chat from "./Chat";
import {socket} from "../intitateConnection";
import style from "./Game.module.css";



const Game = memo(({players}) => {
    const [visibility, revealPrompt] = useState("none");
    useEffect(() => {
        socket.on('prompt', () => {
            revealPrompt("block");
        })
    });


    return (
        <div className={style.gameWrapper}>
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
            display: vis
        }} className={style.form}>
            <form onSubmit={(e) => {
            set("none");
            setText('');
            e.preventDefault();
        }}>
                <input type={"text"} value={text} onChange={(e) => setText(e.target.value)}/>
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