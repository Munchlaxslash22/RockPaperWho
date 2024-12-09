import {memo, useEffect, useRef, useState} from "react";
import Chat from "./Chat";
import {socket} from "../intitateConnection";
import style from "./Game.module.css";

const Game = memo(({players, unload}) => {
    const [vote, setVote] = useState(null);
    const [plObj, setPlObj] = useState({});
    const [isPrompt, prompt] = useState(false);
    useEffect(() => {
        Object.keys(players).forEach((id) => {
            setPlObj(obj => {
                obj[id] = {
                    name: players[id],
                    vote: null
                };
                return {...obj};
            })
        });
        socket.on('prompt', () => {
            console.log("get prompt")
            prompt(true);
        })
        socket.on('vote', (id, vote) => {
            console.log(id, vote);
            setPlObj(obj => {
                obj[id].vote = vote;
                return {...obj};
            });
        });
        socket.on('gameEnd', unload);
        setTimeout(() => {socket.emit('gameStart')}, 1000);

        return () => {
            socket.removeEvents("prompt", "vote", "gameEnd");
        }
    }, [prompt, players, unload, setPlObj]);

    return (isPrompt ? <Prompt set={prompt}/> : (
        <div style={{
                display: "flex"
            }}>
            <div className={"block"} style={{
                position: "absolute",
                right: "70vw",
                top: "20vh"
            }}>
                <Voter vote={vote} setVote={setVote} />
            </div>
            <div className={style.gameWrapper + " block"}>
                <div>
                    <ActivePrompt vote={vote}/>
                    <Timer/>
                    <button onClick={() => socket.emit('breakPrompts')}>BREAK PROMPTS</button>
                    <button onClick={() => socket.emit('breakRound')}>BREAK ROUND</button>
                    {/*<button onClick={() => {
                        prompt(true);
                    }}>revealPrompt</button>*/}
                    <Chat players={plObj}/>
                </div>
            </div>
            <div className={"block"} style={{
                position: "absolute",
                left: "70vw",
                top: "20vh"
            }}>
                <Leaderboard players={plObj}/>
            </div>
        </div>
            )

    )
});


function Voter({vote, setVote}) {
    function voting(num) {
        setVote(num);
        socket.emit("vote", num)
    }

    return (
        <>
            <button onClick={() => voting(1)} className={style.vote + " " + style.red + " " + (vote != null ? (vote === 1 ? style.selected : "") : "")}>
            </button>
            <button onClick={() => voting(2)} className={style.vote + " " + style.blue + " " + (vote != null ? (vote === 2 ? style.selected : "") : "")}>
            </button>
        </>
    )
}

function ActivePrompt ({vote}) {
    const [red, setRed] = useState("Undefined");
    const [blue, setBlue] = useState("Undefined");
    useEffect(() => {
        socket.on('round', (redPrompt, bluePrompt) => {
            setRed(redPrompt);
            setBlue(bluePrompt);
        });

        return () => socket.removeEvents('round');
    }, []);

    return (
        <div>
            <span style={{color: "red", textDecoration: (vote === 1 ? "underline" : "none")}}>{red}</span><br/>
            vs<br/>
            <span style={{color: "blue", textDecoration: (vote === 2 ? "underline" : "none")}}>{blue}</span>
        </div>
    )
}



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

function Leaderboard({players}) {
    const [red, setRed] = useState([]);
    const [blue, setBlue] = useState([]);
    useEffect(() => {
        socket.on('vote', (id, vote) => {
            if (id in red)
                setRed(arr => {
                    return arr.filter(a => a !== id)
                });
            else if (id in blue)
                setBlue(arr => {
                    return arr.filter(a => a !== id)
                });

            if (vote === 1)
                setRed(arr => {
                    arr.push(id);
                    return arr;
                })
            else if (vote === 2)
                setBlue(arr => {
                    arr.push(id);
                    return arr;
                })
        })
    }, [setRed, setBlue, red, blue])


    return Object.values(players).map(pl => <div style={{
        padding: "2px",
        fontSize: "15px",
        color: pl.vote != null ? (pl.vote === 1 ? "red" : "blue") : "black"
    }}>{pl.name}</div>)
}

export default Game;
