import {memo, useEffect, useRef, useState} from "react";
import Chat from "./Chat";
import {socket} from "../intitateConnection";
import style from "./Game.module.css";



const Game = memo(({players, unload}) => {
    const [isPrompt, prompt] = useState(false);
    const [plObj, setPlObj] = useState({});
    useEffect(() => {
        socket.on('prompt', () => {
            prompt(true);
        })
        socket.on('vote', (id, vote) => {
            setPlObj(obj => {
                obj[id].vote = vote;
                return obj;
            })
        })
        socket.on('gameEnd', unload);

        let obj = {}
        Object.keys(players).forEach((id) => {
            obj[id] = {
                name: players[id],
                vote: null
            }
        })
        setPlObj(obj);
    }, [prompt, players, unload]);

    return (isPrompt ? <Prompt set={prompt}/> : (
        <div style={{
                display: "flex"
            }}>
                <div className={style.gameWrapper + " block"}>
                    <div>
                        <Timer/>
                        {/*<button onClick={() => {
                            prompt(true);
                        }}>revealPrompt</button>*/}
                        <Chat players={players}/>
                    </div>
                </div>
            <div className={"block"} style={{
                position: "absolute",
                left: "70vw",
                top: "20vh"
            }}>
                <Leaderboard plObj={plObj}/>
            </div>
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
        <h1 style={{
            color: "white",
            textShadow: "-2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000, 2px 2px 0 #000"
        }}>Who and or what?</h1>
        <div className={style.prompt}>
            <form onSubmit={(e) => {
                e.preventDefault();
                if (text.trim() === "") return;
                socket.emit("prompt", text.trim());
                set(false);
        }}>
                <input ref={inpRef} type={"text"} value={text} onChange={(e) => setText(e.target.value)}/>
            </form>
        </div>
            </>
            );
}

function Timer() {
    const [time, setTime] = useState("0:00");
    useEffect(() => {
        socket.on('time', (minute, second) => {
            setTime(`${minute}:${second}`);
        })
    }, []);

    return <div style={{
        height: "50px",
        fontSize: "50px"
    }}>{time}</div>;
}

function Leaderboard({plObj}) {
    return Object.values(plObj).map(pl => <div style={{
        padding: "2px",
        fontSize: "15px",
        color: pl.vote != null ? (pl.vote == 1 ? "red" : "blue") : "black"
    }}>{pl.name}</div>)
}

export default Game;