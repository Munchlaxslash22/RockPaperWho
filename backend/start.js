const { Server } = require('socket.io');
const io = new Server({
    cors: {
        origin: '*',
    }
});

const players = [];

io.on('connection', (socket) => {
    socket.on('setup', (name) => {
        console.log(name);
        players.push({
            name: name,
            socket: socket,
        });
        io.emit('setup', players.map(p => {return {name: p.name}}))
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