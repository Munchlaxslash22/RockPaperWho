import {connectedPlayers} from "../App";

export default Scoreboard() {
    return (<div>
        Blue:
        {Object.values(connectedPlayers).filter(({vote}) => vote === 1).map(({name}) => <p>{name}</p>) }
        Red:
        {Object.values(connectedPlayers).filter(({vote}) => vote === 0).map(({name}) => <p>{name}</p>) }
    </div>)
}