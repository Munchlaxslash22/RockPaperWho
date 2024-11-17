// This will send whatever you type in to whoever sends a request

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

const players = {};
const getPlayers = () => Object.values(players);
const getConnectedIDs = () => Object.keys(players);

const activeLobbys = {};


// ON PLAYER CONNECTION
io.on('connection', (socket) => {

    socket.on('setup', (name) => {
        let id = Math.floor(Math.random() * 65536).toString(16);
        while (id in getConnectedIDs())
            id = Math.floor(Math.random() * 65536).toString(16);

        console.log(name);
        players[id] = {
            name: name,
            socket: socket
        }

        io.emit('setup', getPlayers().map(p => {return {name: p.name}}));
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