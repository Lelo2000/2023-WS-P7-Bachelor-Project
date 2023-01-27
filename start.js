import { dirname, join } from "path";
import { fileURLToPath } from "url";
import express from "express";
import http from "http";
import { Server } from "socket.io";

const app = express();
let server = http.Server(app);
const io = new Server(server);

const __dirname = dirname(fileURLToPath(import.meta.url));

const port = 8090;

app.use(express.static(__dirname + "/public"));
/*************************************
 * Setup Server URLS
 *************************************/
console.log(__dirname + "/public/index.html");

app.get("/", (req, res) => {
  console.log(__dirname + "/public/index.html");
  res.sendFile(__dirname + "/public/index.html");
});

/*************************************
 * Setup Socket io on connection
 *************************************/
io.on("connection", (socket) => {
  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

server.listen(port, function () {
  console.log(`Server is listening on ${server.address().port}`);
});
