import {memo, useEffect, useRef, useState} from "react";
import Chat from "./Chat";
import {socket} from "../intitateConnection";
import style from "./Game.module.css";



const Game = memo(({players}) => {
    const [isPrompt, prompt] = useState(false);
    useEffect(() => {
        socket.on('prompt', () => {
            prompt(true);
        })
    }, [prompt]);


    return (isPrompt ? <Prompt set={prompt}/> : (
                <div className={style.gameWrapper + " block"}>
                    <div>
                        <Timer/>
                        <button onClick={() => {
                            prompt(true);
                        }}>revealPrompt</button>
                        <Chat players={players}/>
                    </div>
                    <Leaderboard/>
                </div>
            )

    )
});



function Prompt({set}) {
    const [text, setText] = useState('');
    const inpRef = useRef();
    useEffect(() => {
        inpRef.current.focus();
    }, []);

    return (<>
        <div className={"block"}></div>
        <div className={style.form}>
            <form onSubmit={(e) => {
            set(false);
            e.preventDefault();
        }}>
                <input ref={inpRef} type={"text"} value={text} onChange={(e) => setText(e.target.value)}/>
            </form>
        </div>
        </>
            );
}

function Timer() {
    return <p>Timer</p>;
}

function Leaderboard() {
    return <p>Leaderboard</p>;
}

export default Game;