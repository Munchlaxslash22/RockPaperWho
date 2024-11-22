import Player from "./Player.js";
import { Server } from "socket.io";
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

const activeLobbys = {};


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

        socket.emit('setup', id);

        socket.on('disconnect', () => {
            players[id].currentSocket = null;
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