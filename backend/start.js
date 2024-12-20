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

export const removePlayer = (id) => delete players[id];


// ON PLAYER CONNECTION
io.on('connection', (socket) => {
    socket.on('setup', (id) => {
    let pl;
    if (players[id]){
        pl = players[id];
        console.log("User " + id + " reconnected.");
    }else {
        id = Math.floor(Math.random() * 4294967295).toString(16);
        while (id in getConnectedIDs())
            id = Math.floor(Math.random() * 4294967295).toString(16);
        pl = new Player(id);
        players[id] = pl;
        console.log("New user created: " + id);
    }

    pl.connect(socket);
	    
	socket.on('startLobby', (name) => {
        pl.name = name;
        let lobby = new Lobby(pl);
		socket.emit('lobby', {
			state: true,
			names: [pl.name],
			ids: [id],
        isHost: true,
			roomCode: lobby.roomCode		});
		console.log(`User ${name}, initiated lobby: ${lobby.roomCode}`);
        });

    socket.on('joinLobby', (roomCode, name) => {
        pl.name = name;
        let lobby = Lobby.lobbyList[roomCode];
        if (lobby){
            if(lobby.playerJoin(pl)){
                socket.emit('lobby', {
                    state: true,
                    names: lobby.playerList.map(p => p.name),
                    ids: lobby.playerList.map(p => p.id),
                    isHost: false,
                    roomCode: roomCode
                });
            } else {
                socket.emit('lobby', {
                    state: false,
                    message: "Lobby is full (max 8)"
                });
            }
        } else {
            socket.emit('lobby', {
                state: false,
                message: "Lobby does not exist"
            });
        }
    });

    });


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
