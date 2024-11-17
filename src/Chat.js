import {useState} from "react";
import enterButtonImage from ".//.resources/Enter_Button.jpg";

export function Chat() {
    const [ChatMessages, setChatMessages] = useState('');
    const [msg, setMsg] = useState('');


    const TextChat = function () {
        return (
        <textarea readOnly id="chat">
        {ChatMessages}
        </textarea>
        )}

    function chat(e) {
        if (msg.trim() === "") return;
        setChatMessages(ChatMessages + msg);
        setMsg('');
        e.preventDefault();
        // You got this Jack! You can do it! o/
        // Hey if you see this, I've pushed correctly :)
    }

    return (
        <>
            <TextChat/>
            <form onSubmit={chat}>
                <input value={msg} onChange={e => setMsg(e.target.value)}
                       placeholder={"Type words"} autoFocus id="typeChat">
                </input><img src={enterButtonImage} onClick={chat} id={"chatButton"} alt={"Enter"}/>
            </form>
            {msg}
        </>
    )
}