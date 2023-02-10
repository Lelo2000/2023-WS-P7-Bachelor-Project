import { dirname, join } from "path";
import { fileURLToPath } from "url";
import express from "express";
import http from "http";
import { Server } from "socket.io";
import { EVENTS } from "./public/js/constants.js";
import { readFile } from "fs/promises";
import MessageManager from "./server/messageManager.js";

const app = express();
let server = http.Server(app);
const io = new Server(server);

const __dirname = dirname(fileURLToPath(import.meta.url));

const messageManager = new MessageManager(io);

const port = 8090;

app.use(express.static(__dirname + "/public"));
/*************************************
 * Setup Server URLS
 *************************************/

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/start.html");
});

app.get("/simulation", (req, res) => {
  res.sendFile(__dirname + "/public/websites/simulation.html");
});

app.get("/ideas", (req, res) => {
  res.sendFile(__dirname + "/public/websites/ideas.html");
});
/*************************************
 * Setup Socket io on connection
 *************************************/
io.on("connection", (socket) => {
  messageManager.newConnection(socket);

  socket.on(EVENTS.CLIENT.REQUEST_PROPOSAL_OBJECTS, async () => {
    try {
      let proposalsJSON = await readFile("./storage/proposals.json");
      let proposals = JSON.parse(proposalsJSON);
      let chosenProposal = proposals.proposals[0];

      let chosenProposalJSON = JSON.stringify(chosenProposal);
      socket.emit(EVENTS.SERVER.RECIEVE_PROPOSAL_OBJECTS, {
        data: chosenProposalJSON,
      });
    } catch (err) {
      console.error(err);
    }
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

server.listen(port, function () {
  console.log(`Server is listening on ${server.address().port}`);
});
