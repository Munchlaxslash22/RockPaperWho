import {useState} from "react";
import enterButtonImage from "../.resources/Enter_Button.jpg";
import pressedButtonIMG from "../.resources/Enter_Button_Pressed.jpg";
import {socket} from "../intitateConnection";

export default function Chat() {
    const [ChatMessages, setChatMessages] = useState('');
    const [msg, setMsg] = useState('');
    const [img, setImg] = useState(enterButtonImage);


    //all messages come from here, and messages sent loop around.
    socket.on('chat', (msg, name) => {
        setChatMessages(ChatMessages + `\n$[{name}] ` + msg);
    })

    function chat(e) {
        if (msg.trim() === "") return;
        // sends message
        socket.emit('chat', msg);
        setMsg('');
        e.preventDefault();
    }

    return (
        <>
            <textarea readOnly id="chat">
                {ChatMessages}
            </textarea>


            <form onSubmit={chat}>
                <input value={msg} onChange={e => setMsg(e.target.value)}
                       placeholder={"Type words"} autoFocus id="typeChat">
                </input><img src={img} onClick={function (e) {
                    chat(e);
                    setImg(pressedButtonIMG);
                    setTimeout(() => {
                        setImg(enterButtonImage)
                    }, 500);
                }} id={"chatButton"} alt={"Enter"}/>
            </form>
            {msg}
        </>
    )
}