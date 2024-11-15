import "./App.css";
import {Chat} from "./Chat";
import {useRef, useState} from "react";
import {socket} from "./intitateConnection";

function connect() {socket.connect()}


function App() {
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

  return (
      <div className="App-header">
          <div id="center">
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
          </div>
      </div>
  );
}

export default App;
