import io from "socket.io-client";
import Cookies from "js-cookie";

let url;
if (process.env.REACT_APP_SERVER_URL)
    url = process.env.REACT_APP_SERVER_URL;
else
    url = "http://localhost:8888/"


const s = io(url);

let getID = new Promise((resolve) => {
    s.on("setup", (id) => resolve(id))
});

let id = "" + Cookies.get("id");
s.emit("setup", id);
id = await getID;
Cookies.set("id", id);

s.removeEvents = function (...ev) {
    ev.forEach(e => this.removeListener(e))
};
export const socket = s;
export const clientID = id;