import "./App.css";
import {useRef, useState} from "react";
import {socket, clientID} from "./intitateConnection";
import Lobby from "./comp/Lobby";
import Chat from "./comp/Chat";

function App() {
    const [state, setState] = useState(null);

    let CurrentState = "p";
    switch (state) {
        case 0:
            CurrentState = Login;
            break;
        case 1:
            CurrentState = Chat;
            break;
        case 2:
            CurrentState = Lobby;
            break;
        default:
            break;
    }

    socket.on('lobby', (lobby) => {
        if (lobby.state) {

        } else {
            console.log(lobby.message);
        }
    })


  return (
      <div className="App-header">
          <div id="center">
              <h4>Test buttons</h4>
              <div>
              <button onClick={() => setState(0)}>Login</button>
              <button onClick={() => setState(1)}>Chat</button>
              <button onClick={() => setState(2)}>Lobby</button>

              </div>
          </div>
          <div id="center">
          <CurrentState/>
          </div>
      </div>
  );
}


function Login() {
    const nameRef = useRef("");
    const idRef = useRef("");

    if (typeof clientID == "undefined")
        throw Error;

    function join() {
        let name = nameRef.current.value;
        let roomID = idRef.current.value;
        if (name && roomID) {
            socket.emit("joinLobby", roomID, name);
        }
    }

    async function openLobby() {
        let name = nameRef.current.value;
        if (name) {
            socket.emit("startLobby", name);
        }
    }

    return (<>
        <form onSubmit={(e) => e.preventDefault()}>
            <label aria-label={"name"} htmlFor={"name"}>name</label>:&nbsp;
            <input ref={nameRef} name={"name"} form={"text"}/>&nbsp;&nbsp;
            <label aria-label={"room id"} htmlFor={"roomId"}>room id</label>:&nbsp;
            <input name={"roomID"} form={"text"}/>
            <br />
            <button onClick={join}>Join</button> <button onClick={openLobby}>Create</button>
        </form>
        <p>{process.env.REACT_APP_SERVER_URL}</p>
        </>)
}




export default App;
