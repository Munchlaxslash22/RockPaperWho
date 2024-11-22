import {listPlayers} from "../Lobby";

export default function Scoreboard() {
    return (<div>
        Blue:
        {Object.values(listPlayers).filter(({vote}) => vote === 1).map(({name}) => <p>{name}</p>) }
        Red:
        {Object.values(listPlayers).filter(({vote}) => vote === 0).map(({name}) => <p>{name}</p>) }
    </div>)
}