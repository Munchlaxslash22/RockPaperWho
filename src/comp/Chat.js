import {useState} from "react";
import enterButtonImage from "../.resources/Enter_Button.jpg";
import pressedButtonIMG from "../.resources/Enter_Button_Pressed.jpg";
import {socket} from "../intitateConnection";

export default function Chat({lobby, players}) {
    const [ChatMessages, setChatMessages] = useState('');
    const [msg, setMsg] = useState('');
    const [img, setImg] = useState(enterButtonImage);


    //all messages come from here, and messages sent loop around.
    socket.on('chat', (msg, name) => {
        setChatMessages(ChatMessages + `\r\n[${name}] ` + msg);
    })

    function chat(e) {
        if (msg.trim() === "") return;
        // sends message
        socket.emit('chat', msg);
        setMsg('');
        e.preventDefault();
    }

    return (
        <div>
            <textarea readOnly id="chat" style={{
                backgroundColor: "whitesmoke",
                height: "60vh",
                width: "30vw",
                margin: "10px auto",
                borderWidth: "5px",
                borderRadius: "15px",
                padding: "5px",
                resize: "none"
            }}>
                {ChatMessages}
            </textarea>


            <form onSubmit={chat}>
                <input value={msg} onChange={e => setMsg(e.target.value)}
                       placeholder={"Type words"} autoFocus id="typeChat">
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
            {msg}
        </div>
    )
}