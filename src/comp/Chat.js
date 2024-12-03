import {useEffect, useRef, useState} from "react";
import enterButtonImage from "../.resources/Enter_Button.jpg";
import pressedButtonIMG from "../.resources/Enter_Button_Pressed.jpg";
import {socket} from "../intitateConnection";

const AlwaysScrollToBottom = () => {
    const elementRef = useRef();
    useEffect(() => elementRef.current.scrollIntoView());
    return <div ref={elementRef} />;
};

export default function Chat({lobby, players}) {
    const [ChatMessages, setChatMessages] = useState('');
    const [msg, setMsg] = useState('');
    const [img, setImg] = useState(enterButtonImage);
    useEffect(() => {
        socket.on('chat', (msg, name) => {
            setChatMessages(ChatMessages + `\r\n[${name}] ` + msg);
            console.log(msg);
        })
        socket.on('resetChat', () => {
            setChatMessages('');
            setMsg('');
        })
    }, [setChatMessages, msg, ChatMessages]);

    //all messages come from here, and messages sent loop around.
    

    function chat(e) {
        e.preventDefault();
        if (msg.trim() === "") return;
        // sends message
        socket.emit('chat', msg);
        setMsg('');
    }

    return (
        <div>
            <div style={{
                overflow: "scroll",
                boxSizing: "border-box",
                backgroundColor: "lightgray",
                height: "60vh",
                width: "30vw",
                margin: "10px auto",
                border: "5px black solid",
                borderRadius: "15px",
                resize: "none"
            }}>
                {ChatMessages.split('\n').map((l, i) => <div style={{
                    backgroundColor: i % 2 === 0 ? "white" : "#eee",
                    textAlign: "start",
                    fontSize: "16px",
                    padding: "4px",
                    overflowWrap: "break-word"
                }}>{l}</div>)}
                <AlwaysScrollToBottom/>
            </div>


            <form onSubmit={chat}>
                <input value={msg} onChange={e => setMsg(e.target.value)}
                       placeholder={"Type words"} autoFocus={true}>
                </input><img src={img} style={{
                    width : "50px",
                    verticalAlign: "middle"
            }}  onClick={function (e) {
                    chat(e);
                    setImg(pressedButtonIMG);
                    setTimeout(() => {
                        setImg(enterButtonImage)
                    }, 500);
                }} id={"chatButton"} alt={"Enter"}/>
            </form>
        </div>
    )
}