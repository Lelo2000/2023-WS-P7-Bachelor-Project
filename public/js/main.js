import { EVENTS } from "./constants.js";
import MessageManager from "./messageManager.js";
import World from "./world.js";

const socket = io();
console.log(socket);
const world = new World("simulationCanvas", socket);
const messageManager = new MessageManager(
  socket,
  world,
  "#message-input",
  "#message-send",
  "#messages-area"
);

$(document).ready(function () {
  $(".create-button").on("mousedown", function (event) {
    const htmlObj = event.target;
    const objId = htmlObj.id;
    let imgName = objId.split("-")[1];
    console.log("clicked");
    world.addImage(`./images/${imgName}.png`, { x: 300, y: 300 }, true);
    console.log(event.target.id);
  });

  $("#toggleHeatmap").click(function (e) {
    e.preventDefault();
    world.toggleHeatmap();
  });

  $("#messages-area").on("click", ".message", function (e) {
    let messageId = e.currentTarget.id;
    let changes = messageManager.getMessage(messageId).changes;
    console.log("Message Clicked", messageId, changes);
  });
});

function showChanges(id) {
  console.log("Zeige Changes der Nachricht: ", id);
}
