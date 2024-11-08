import io from "socket.io-client";

const s = io("http://localhost:8888/", {
    autoConnect: false
});

s.on('connect', () => console.log("connected!"));

export const socket = s;