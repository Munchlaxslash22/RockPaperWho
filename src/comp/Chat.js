import {useEffect, useRef, useState} from "react";
import {clientID, socket} from "../intitateConnection";
import style from "./Game.module.css";

function doOnce (thing) {
let bool = false;

    return function () {
        if (!bool) {
            bool = true;
            return this
        }
    }.bind(thing);

}

const AlwaysScrollToBottom = () => {
    const elementRef = useRef();
    useEffect(() => elementRef.current.scrollIntoView());
    return <div ref={elementRef} />;
};


let i = 0;
let CurrentChat = function ({players, setMsg}) {
    const [chatMessages, setChatMessages] = useState([]);
    useEffect(() => {
        socket.on('chat', (msg, id) => {
            console.log(players);
            let pl = players[id];
            if (pl) {
                setChatMessages(arr => {
                    arr.push(<div key={i} style={{
                        backgroundColor: i % 2 === 0 ? "white" : "#f5f5f5",
                        textAlign: "start",
                        fontSize: "16px",
                        padding: "4px",
                        overflowWrap: "break-word"
                    }}> <span style={{
                        color: pl.vote != null ? (pl.vote === 1 ? "red" : "blue") : "black"
                    }}>[{id === clientID ? "You" : pl.name}]</span>&nbsp;&nbsp;{msg}</div>);
                    return [...arr];
                });
                i++;
            }
        });
        socket.on('resetChat', () => {
            setChatMessages([]);
            setMsg('');
        })
        return () => {
            socket.removeEvents("chat", "resetChat");
        }
    }, [players, setMsg, setChatMessages]);

    return (<div className={style.chat}>
        <>
        {chatMessages.map((chatMessage) => (<>{chatMessage}</>))}
        </>
        <AlwaysScrollToBottom/>
    </div>)
};

export default function Chat({players}) {
    const [msg, setMsg] = useState('');


    //all messages come from here, and messages sent loop around.
    function chat(e) {
        e.preventDefault();
        if (msg.trim() === "") return;
        // sends message
        console.log(msg);
        socket.emit('chat', msg);
        setMsg('');
    }

    return (
        <div>
            <CurrentChat setMsg={setMsg} players={players}/>

            <form onSubmit={chat}>
                <input className={style.chatPrompt} value={msg} onChange={e => setMsg(e.target.value)}
                       placeholder={"Type words"} autoFocus={true}>
                </input><button className={style.chatButton} aria-label={"Enter"}/>
            </form>
        </div>
    )
}
