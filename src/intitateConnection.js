import io from "socket.io-client";

let url;
if (process.env.REACT_APP_SERVER_URL)
    url = process.env.REACT_APP_SERVER_URL;
else
    url = "http://localhost:8888/"


const s = io(url);


export const socket = s;