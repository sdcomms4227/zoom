import http from "http";
import { WebSocketServer } from "ws";
import express from "express";

const app = express();

app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));
app.get("/", (req, res) => res.render("home"));
app.use((req, res) => res.redirect("/"));


const handleListen = () => console.log("Listening on http://localhost:3000");

const server = http.createServer(app);
const wss = new WebSocketServer({ server });

const sockets = [];

wss.on("connection", (socket) => {
  sockets.push(socket);
  socket["nickname"] = "Anonymous";
  console.log("connected to browser!!");
  socket.on("close", () => {
    console.log("disconnected from browser!!");
  });
  socket.on("message", (msg) => {
    const msgObject = JSON.parse(msg);
    switch (msgObject.type) {
      case "new_message":
        sockets.forEach((aSocket) => aSocket.send(`${socket["nickname"]}: ${msgObject.payload}`));
        break;
      case "nickname":
        socket["nickname"] = msgObject.payload;
        break;
    }
  });
});

server.listen(3000, handleListen);
