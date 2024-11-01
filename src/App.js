import {useState} from "react";
import "./App.css";

function Chat() {
  const [msgText, setMsgText] = useState('');
  const [msg, setMsg] = useState('');

  const form = (
        <textarea value={msg} onChange={e => setMsg(e.target.value)} placeholder={"Type words"} autoFocus id="typeChat">
        </textarea>
    )

  const TextChat = () => (
      <textarea readOnly id="chat">
        {msgText}
      </textarea>
  )

  function chat(e) {

      setMsgText(msgText + msg);
      setMsg('');
    e.preventDefault();
    // You got this Jack! You can do it! o/
      // Hey if you see this, I've pushed correctly :)
  }

  return (
      <>
        <TextChat />
        <form onSubmit={chat}>
        {form}
          <img src={'/Enter_Button.jpg'} />
        </form>
      </>
  )
}


function App() {
  return (
      <div className="App-header">
        <center>
          <div id="center">
            <Chat />
          </div>
        </center>
      </div>
  );
}

export default App;
