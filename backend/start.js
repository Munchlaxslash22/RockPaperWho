import Player from "./Player.js";
import { Server } from "socket.io";
import Lobby from "./Lobby.js";
let server;
if (process.env.REACT_APP_SERVER_URL && !process.env.REACT_APP_SERVER_URL.includes("localhost")) {
    server = await import("startServer.js");
}

const sOptions = {
    cors: {
        origin: '*',
    }
};

let io;
// interaction
if (server) {
    io = new Server(server, sOptions);
} else {
    io = new Server(sOptions);
}

export const players = {};
export const getPlayers = () => Object.values(players);
export const getConnectedIDs = () => Object.keys(players);


// ON PLAYER CONNECTION
io.on('connection', (socket) => {
    socket.on('setup', (id) => {
        if (players[id]){
            players[id].currentSocket = socket;
            console.log("User " + id + " reconnected.")
        }else {
            id = Math.floor(Math.random() * 4294967295).toString(16);
            while (id in getConnectedIDs())
                id = Math.floor(Math.random() * 4294967295).toString(16);
            players[id] = new Player(id, socket);
            console.log("New user created: " + id);
        }

        let pl = players[id];

        socket.emit('setup', id);

        socket.on('disconnect', () => {
            pl.currentSocket = null;
            socket.removeAllListeners();
        })
	    
	socket.on('startLobby', (name) => {
            pl.name = name;
            let lobby = new Lobby(pl);
		socket.emit('lobby', {
			state: true,
			names: [pl.name],
			ids: [id],
			roomCode: lobby.roomCode		});
		console.log(`User ${name}, initiated lobby: ${lobby.roomCode}`);
        })

        socket.on('joinLobby', (roomCode, name) => {
            pl.name = name;
            let lobby = Lobby.lobbyList[roomID];
            if (lobby){
                if(lobby.playerJoin(pl)){
                    socket.emit('lobby', {
                        state: true,
                        names: lobby.playerList.map(p => p.name),
			ids: lobby.playerList.map(p > p.id),
                        id: roomID
                    })
                } else {
                    socket.emit('lobby', {
                        state: false,
                        message: "Lobby is full (max 8)"
                    })
                }
            } else {
                socket.emit('lobby', {
                    state: false,
                    message: "Lobby does not exist"
                })
            }
        })

    })


    socket.on('disconnect', () => {
        console.log('Lost connection to ' + socket.conn.remoteAddress);

    })
    console.log('New connection from ' + socket.conn.remoteAddress);
})

// when code is exited out, program ends, ctrl + c
process.on('exit', () => {
    io.close();
})

io.listen(8888);
