import "./App.css";
import {useRef, useState} from "react";
import Cookies from "js-cookie";
import {socket} from "./intitateConnection";
import Lobby from "./comp/Lobby";
import Chat from "./comp/Chat";


export const connectedPlayers = {};
export let clientId = 0;

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


    async function join() {
        let getID = new Promise((resolve) => {
            socket.on("setup", (id) => resolve(id))
        });

        let id = Cookies.get("id");
        socket.emit("setup", id);
        id = await getID;
        Cookies.set("id", id);
        clientId = id;
    }

    return (<>
        <form onSubmit={(e) => e.preventDefault()}>
            <label aria-label={"name"} htmlFor={"name"}>name</label>:&nbsp;
            <input ref={nameRef} name={"name"} form={"text"}/>&nbsp;&nbsp;
            <label aria-label={"room id"} htmlFor={"roomId"}>room id</label>:&nbsp;
            <input name={"roomID"} form={"text"}/>
            <br />
            <button onClick={join}>Join</button> <button>Create</button>
        </form>
        <p>{process.env.REACT_APP_SERVER_URL}</p>
        </>)
}


export default App;
