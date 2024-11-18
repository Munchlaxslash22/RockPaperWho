import "./App.css";
import Chat from "./Chat";
import {useRef, useState} from "react";
import {socket} from "./intitateConnection";
import Lobby from "./Lobby";


function connect() {socket.connect()}


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
        default:

    }


  return (
      <div className="App-header">
          <div id="center">
              <h4>Test buttons</h4>
              <div>
              <button onClick={() => setState(0)}>Login</button>
              <button onClick={() => setState(1)}>Chat</button>
              </div>
          </div>
          <div id="center">
          <CurrentState/>
          </div>
      </div>
  );
}

function Login() {
    const [players, setPlayers] = useState([]);
    const nameRef = useRef(null);

    socket.on('setup', pl => {
        console.log(pl)
        try{
            setPlayers(pl);
        }
        catch (e){
            throw e;
        }
    })

    function join(){socket.emit('setup', nameRef.current.value)}

    return (<>
        <button onClick={connect}>Connect</button>
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
