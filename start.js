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

const port = 8090;

console.log("Lade Projektliste...");
let projectList;
try {
  let proposalsJSON = await readFileSync("./storage/project.json");
  projectList = JSON.parse(proposalsJSON).projects;
} catch (err) {
  console.error(err);
}
console.log("Projektliste erfolgreich geladen");

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
  res.sendFile(__dirname + "/public/websites/ideas.html");
});

/*************************************
 * Setup Socket io on connection
 *************************************/
io.on("connection", (socket) => {
  messageManager.newConnection(socket);
  ideaManager.newConnection(socket);
  attributeManager.newConnection(socket);
  socket.on(EVENTS.CLIENT.REQUEST_PROPOSAL_OBJECTS, async () => {
    // try {
    //   let proposalsJSON = await readFile("./storage/project.json");
    //   let projectList = JSON.parse(proposalsJSON);
    //   let chosenProposal = projectList[0].proposals.proposals[0];
    //   let chosenProposalJSON = JSON.stringify(chosenProposal);
    //   socket.emit(EVENTS.SERVER.RECIEVE_PROPOSAL_OBJECTS, {
    //     data: chosenProposalJSON,
    //   });
    // } catch (err) {
    //   console.error(err);
    // }
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
  for (let i = 0; i < projectList.length; i++) {
    if (projectList[i].id == searchedId) {
      return projectList[i];
    }
  }
  return false;
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
