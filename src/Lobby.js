import {socket} from "./intitateConnection";

export default class Lobby extends React.Component {
    isPlayerRefresh = false;

    shouldComponentUpdate(nextProps, nextState, nextContext) {
        if (this.isPlayerRefresh === true){
            this.isPlayerRefresh = false;
            return true;
        }
        return false;
    }
    first = true;

    listPlayers = {};

    render() {
        if (this.first){
            socket.on('join', (player) => {
                this.listPlayers[player.id] = player;
                this.isPlayerRefresh = true;
                this.render();
            });
            socket.on('exit', ({id}) => {
                delete this.listPlayers[id];
                this.isPlayerRefresh = true;
                this.render();
            });
            this.first  = false;
        }
        return (<div>
            {Object.values(this.listPlayers).map(player => {
                return <p key={player.id}>{player.name}</p>
            })}
            </div>);


    }
}