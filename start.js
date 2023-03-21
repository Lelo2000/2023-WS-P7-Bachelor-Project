import path, { dirname, join } from "path";
import { fileURLToPath } from "url";
import express from "express";
import http from "http";
import { Server } from "socket.io";
import { EVENTS, PROJECT } from "./public/js/constants.js";
import { readFile } from "fs/promises";
import MessageManager from "./server/messageManager.js";
import IdeaManager from "./server/ideaManager.js";
import fs, { readFileSync } from "fs";
import AttributeManager from "./server/attributeManager.js";

const app = express();
let server = http.Server(app);
const io = new Server(server);

const __dirname = dirname(fileURLToPath(import.meta.url));

const messageManager = new MessageManager(io);
const ideaManager = new IdeaManager(io);
const attributeManager = new AttributeManager(io);

const objectsData = loadObjectsData();

const projectList = new Map();
const port = 8090;

console.log("Lade Projektliste...");

try {
  let proposalsJSON = readFileSync("./storage/project.json");
  JSON.parse(proposalsJSON).projects.forEach((project) => {
    if (project.phase === PROJECT.PHASE.CO_CREATION)
      project.proposals.forEach((proposal) => {
        messageManager.loadMessagesFromArray(proposal.messages, proposal.id);
      });
    projectList.set(project.id, project);
  });
} catch (err) {
  console.error(err);
}

console.log("Projektliste erfolgreich geladen");

app.use(express.static(__dirname + "/public"));
/*************************************
 * Setup Server URLS
 *************************************/

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/websites/ideas.html");
});

app.get("/simulation", (req, res) => {
  res.sendFile(__dirname + "/public/websites/simulation.html");
});

app.get("/ideas", (req, res) => {
  res.sendFile(__dirname + "/public/websites/ideas.html");
});

app.get("/attribute", (req, res) => {
  res.sendFile(__dirname + "/public/websites/attribute.html");
});

app.get("/co-creation", (req, res) => {
  res.sendFile(__dirname + "/public/websites/co-creation.html");
});

app.get("/proposal/", async (req, res) => {
  let proposalId = req.query.proposalId;
  let project = getProjectWithId(proposalId);
  console.log(project.phase);
  switch (project.phase) {
    case PROJECT.PHASE.COLLECT_ATTRIBUTES:
      res.redirect("/attribute");
      break;
    case PROJECT.PHASE.CO_CREATION:
      res.redirect("/co-creation");
      break;
  }
  console.log(
    "Proposal mit der Id: " + proposalId + " soll aufgerufen werden."
  );
});

/*************************************
 * Setup Socket io on connection
 *************************************/
io.on("connection", (socket) => {
  messageManager.newConnection(socket);
  ideaManager.newConnection(socket);
  attributeManager.newConnection(socket);
  socket.on(EVENTS.CLIENT.REQUEST_PROPOSALS, async () => {
    if (socket.handshake.headers.referer.indexOf("co-creation") >= 0) {
      socket.emit(EVENTS.SERVER.SEND_PROPOSALS, {
        data: projectList.get(2).proposals,
      });
      return;
    }
  });

  socket.on(EVENTS.CLIENT.REQUEST_OBJECTS_DATA, () => {
    socket.emit(EVENTS.SERVER.SEND_OBJECTS_DATA, { data: objectsData });
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

server.listen(port, function () {
  console.log(`Server is listening on ${server.address().port}`);
});

function getProjectWithId(searchedId) {
  return projectList.get(Number(searchedId));
}

function loadObjectsData() {
  //Die Funktion wurde mit Hilfe von Chat GPT erstellt.
  const files = fs.readdirSync("./storage/objects");
  const jsonFiles = files.filter((file) => path.extname(file) === ".json");

  const results = [];

  jsonFiles.forEach((jsonFile) => {
    const filePath = path.join("./storage/objects", jsonFile);
    const fileContents = fs.readFileSync(filePath, "utf8");
    const json = JSON.parse(fileContents);
    results.push(json);
  });
  return results;
}
