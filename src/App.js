import "./App.css";
import {useEffect, useRef, useState} from "react";
import {socket, clientID} from "./intitateConnection";
import Lobby from "./comp/Lobby";
import Chat from "./comp/Chat";
import Game from "./comp/Game";
import logoIMG from "./.resources/rockpaper.png";



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
        });
        return () => {
            socket.removeEvents("lobby");
        }
    }, [setState]);

 
  return (
      <div className="background1">
          <div className="background2">
              <div className="App-header">
                  <Current state={state} setState={setState}/>
              </div>
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
    currentProps.isHost = lobby.isHost;
	currentProps.roomCode = lobby.roomCode;
}



function Login() {
    const nameRef = useRef("");
    const idRef = useRef("");

    if (typeof clientID == "undefined")
        throw Error;

    function join() {
        let name = nameRef.current.value;
        let roomCode = idRef.current.value.toLowerCase();
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

        <img src={logoIMG} alt="Rock Paper Who" style={{
            width: "50vw",
            clipPath: "inset(20% 10% 25% 10% round 5% 5% 5% 5%)"
        }}/>

        <div className={"block"}>
        <form onSubmit={(e) => e.preventDefault()}>
            <label aria-label={"name"} htmlFor={"name"}>name</label>:&nbsp;
            <input type="text" ref={nameRef} name={"name"} form={"text"}/>&nbsp;&nbsp;
            <label aria-label={"room id"} htmlFor={"roomId"}>room id</label>:&nbsp;
            <input type="text" ref={idRef} name={"roomID"} form={"text"}/>
            <br />
            <button onClick={join}>Join</button> <button onClick={openLobby}>Create</button>
        </form>
        <p>{process.env.REACT_APP_SERVER_URL}</p>
    </div></>)
}




export default App;
