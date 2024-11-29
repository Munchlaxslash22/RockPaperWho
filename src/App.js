import "./App.css";
import {useRef, useState} from "react";
import {socket, clientID} from "./intitateConnection";
import Lobby from "./comp/Lobby";
import Chat from "./comp/Chat";



function conditionalRender() {
	return (props) => {
	switch (props.state) {
		case "login":
			return <Login {...props} />
		case "lobby":
			return <Lobby {...props} />
	}
	}
}

let Current = conditionalRender();
let currentProps = {};

function App() {
    const [state, setState] = useState("login");

   socket.on('lobby', (lobby) => {
        if (lobby.state) {
		openLobby(lobby);
		setState("lobby");
        } else {
            console.log(lobby.message);
        }
    })
 
  return (
      <div className="App-header">
          <div id="center">
              <h4>Test buttons</h4>
              <div>
              <button onClick={() => setState("login")}>Login</button>
              <button onClick={() => setState("chat")}>Chat</button>
              <button onClick={() => setState("lobby")}>Lobby</button>

              </div>
          </div>
          <div id="center">
          <Current state={state} {...currentProps} />
          </div>
      </div>
  );
}

function openLobby(lobby){
	let players = {};
	lobby.ids.forEach((id, index) => {
		players[id] = lobby.names[index];
	});
	currentProps.players = players;
	currentProps.id = lobby.id;
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
