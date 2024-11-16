// This will send whatever you type in to whoever sends a request

import {createServer} from  "http";
import fs from "fs";


const server = createServer()

server.on('request', (req , res) => {
    if (req.url === "/favicon.ico") {
        res.statusCode = 404;
        res.end()
    }

    res.statusCode = 200;
    res.setHeader("Content-Type", "text/html");

    fs.readFile("index.html", (err, data) => {

    })

});


// ON PLAYER CONNECTION

process.on('close', server.close);

server.listen(80);

export default server;