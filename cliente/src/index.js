import { io } from "../node_modules/socket.io-client/dist/socket.io.esm.min.js";
import MapHandler from "./MapHandler.js";

const socket = io("http://localhost:3000");
socket.on("connection", (data) => {
    console.log("estoy conectado");
    socket.on("respuesta", (dato) => {
        console.log(dato);
    });
});

socket.on('map', (data) => {
    console.log(data);
    MapHandler.init(data);
});

document.addEventListener('keydown', (event) => {
    socket.broadcast.emit("hello", "world");
});

console.log(socket);

socket.emit("mensaje", "hola");
