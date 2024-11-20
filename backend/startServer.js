// This will send whatever you type in to whoever sends a request
import {createServer} from  "node:http";
import fs from "fs";


const server = createServer((req, res) => {
    res.setHeader("Content-Type", "text/html");
    let url = req.url;
    if (url == "/") url = "/index.html";



    fs.readFile("./build" + url, (err, data) => {
        if (err) {
            console.log(err)
            res.statusCode = 404;
            res.end();
        } else{
            res.statusCode = 200;
            res.end(data);
        }
    })
    console.log("Request for " + req.url);
})



// ON PLAYER CONNECTION

process.on('close', server.close);

server.listen(80);

export default server;