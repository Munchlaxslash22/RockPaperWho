import "./App.css";
import {useEffect, useRef, useState} from "react";
import {socket, clientID} from "./intitateConnection";
import Lobby from "./comp/Lobby";
import Chat from "./comp/Chat";
import Game from "./comp/Game";



function conditionalRender() {
	return (props) => {
	let Comp;
    switch (props.state) {
        case "login":
            Comp = Login
            break;
        case "lobby":
            Comp = Lobby;
            break;
        case "chat":
          Comp = Chat;
          break;
        case "game":
            Comp = Game;
            break;
        default:
            Comp = <p>Not real</p>;
            break;
    }
	return <Comp {...currentProps} />
	}
}

let Current = conditionalRender();
let currentProps = {};

function App() {
    const [state, setState] = useState("login");
    useEffect(() => {
        socket.on('lobby', (lobby) => {
            if (lobby.state) {
                openLobby(lobby);
                setState("lobby");
            } else {
                console.log(lobby.message);
            }
        })
    }, [setState]);

   
 
  return (
      <div className="App-header">
          <div id="center">
              <h4>Test buttons</h4>
              <div>
              <button onClick={() => setState("login")}>Login</button>
              <button onClick={() => setState("chat")}>Chat</button>
              <button onClick={() => setState("lobby")}>Lobby</button>
              <button onClick={() => setState("game")}>Game</button>

              </div>
          </div>
          <div id="center">
          <Current state={state} setState={setState}/>
          </div>
      </div>
  );
}

function openLobby(lobby){
	let players = {};  
    console.log(lobby);
	lobby.ids.forEach((id, index) => {
		players[id] = lobby.names[index];
	});
	console.log(players);
	currentProps.players = players;
	currentProps.roomCode = lobby.roomCode;
}



function Login() {
    const nameRef = useRef("");
    const idRef = useRef("");

    if (typeof clientID == "undefined")
        throw Error;

    function join() {
        let name = nameRef.current.value;
        let roomCode = idRef.current.value;
        if (name && roomCode) {
		console.log("connecting");
            socket.emit("joinLobby", roomCode, name);
        }
    }

    function openLobby() {
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
            <input ref={idRef} name={"roomID"} form={"text"}/>
            <br />
            <button onClick={join}>Join</button> <button onClick={openLobby}>Create</button>
        </form>
        <p>{process.env.REACT_APP_SERVER_URL}</p>
        </>)
}




export default App;
