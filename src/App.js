import {useState} from "react";
import "./App.css";

function Chat() {
  const [msgText, setMsgText] = useState('Epic');


  const form = (
        <textarea placeholder={"Type words"} autoFocus id="typeChat">
        </textarea>
    )

  const TextChat = () => (
      <textarea readOnly id="chat">
        {msgText}
      </textarea>
  )

  function chat(e) {

      setMsgText(msgText + "!!");
    e.preventDefault();
    // You got this Jack! You can do it! o/
  }

  return (
      <>
        <TextChat />
        <form onSubmit={chat}>
        {form}
          <button>
            Chat
          </button>
        </form>
          <p>{msgText}</p>
      </>
  )
}


function App() {
  return (
      <div className="App-header">
        <center>
          <div id="center">
            test
            <Chat />
          </div>
        </center>
      </div>
  );
}

export default App;
