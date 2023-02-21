import { EVENTS } from "../constants.js";
import MessageManager from "./messageManager.js";
import World from "./world.js";

const socket = window.socket;

const world = new World("simulationCanvas", socket);

window.addEventListener(EVENTS.SIMULATION.ADD_OBJECT, (eventData) => {
  let objectData = eventData.detail;
  world.addObjectFromObjectData(objectData, {
    x: world.canvas.getWidth() / 2,
    y: world.canvas.getHeight() / 2,
  });
});
// const messageManager = new MessageManager(
//   socket,
//   world,
//   "#message-input",
//   "#message-send",
//   "#messages-area"
// );

// $(document).ready(function () {
//   $(".create-button").on("mousedown", function (event) {
//     const htmlObj = event.target;
//     const objId = htmlObj.id;
//     let imgName = objId.split("-")[1];
//     world.addImage(`./images/${imgName}.png`, { x: 300, y: 300 }, true);
//   });

//   $("#toggleHeatmap").click(function (e) {
//     e.preventDefault();
//     world.toggleHeatmap();
//   });

//   $("#messages-area").on("click", ".message", function (e) {
//     messageManager.messageClicked(e.currentTarget.id);
//   });
// });

// function showChanges(id) {
//   console.log("Zeige Changes der Nachricht: ", id);
// }
