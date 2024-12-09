import io from "socket.io-client";
import Cookies from "js-cookie";

let url;
if (process.env.REACT_APP_SERVER_URL)
    url = process.env.REACT_APP_SERVER_URL;
else
    url = "http://" + window.location.hostname + ":8888";
console.log(url);

const s = io(url);

let getID = new Promise((resolve) => {
    s.on("setup", (id) => resolve(id))
});

let id = "" + Cookies.get("id");
s.emit("setup", id);
id = await getID;
Cookies.set("id", id);

s.removeEvents = function (...ev) {
    ev.forEach(e => this.removeAllListeners(e))
};
export const socket = s;
export const clientID = id;
