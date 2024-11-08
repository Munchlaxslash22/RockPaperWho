import "./App.css";
import {Chat} from "./Chat";
import {useRef, useState} from "react";
import {socket} from "./intitateConnection";


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

  return (
      <div className="App-header">
        <center>
          <div id="center">
              <button onClick={() => socket.connect()}>Connect</button>
              <button onClick={() => socket.emit('setup', nameRef.current.value)}>Join</button>
              <form onSubmit={(e) => e.preventDefault()}>
                  <label aria-label={"name"} htmlFor={"name"}>name</label>
                  <input ref={nameRef} name={"name"} form={"text"}/>
              </form>
              <table id={"#tab"}>
                  {
                      players.map(player => {
                          return (<>
                          <tr>
                              <td>
                                  {player.name} is connected.
                              </td>
                          </tr>
                          </>)
                      })
                  }
              </table>
              <p>{process.env.REACT_APP_SERVER_URL}</p>
          </div>
        </center>
      </div>
  );
}

export default App;
