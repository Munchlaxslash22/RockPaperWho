// This will send whatever you type in to whoever sends a request

const {createServer} = require('http');
const { Server } = require('socket.io');

const players = [];

const server = createServer();
const io = new Server(server, {
    cors: {
        origin: '*',
    }
});

io.on('connection', (socket) => {
    socket.on('setup', (name) => {
        console.log(name);
        players.push({
            name: name,
            socket: socket,
        });
        socket.emit('setup', players.map(p => {return {name: p.name}}))
    })

    console.log("connected !!!");
})

// when code is exitted out, program ends, ctrl + c
process.on('exit', () => {
    io.close();
})

server.listen(8888);