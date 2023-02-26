import { EVENTS } from "../constants.js";
import World from "./world.js";

const socket = window.socket;

const world = new World("simulationCanvas", socket);

window.addEventListener(EVENTS.SIMULATION.ADD_OBJECT, (eventData) => {
  let newObject = eventData.detail;
  world.addObjectFromObjectData(newObject, {
    x: world.canvas.getWidth() / 2,
    y: world.canvas.getHeight() / 2,
  });
});

window.addEventListener(EVENTS.SIMULATION.LOAD_OBJECT, (eventData) => {
  let object = eventData.detail.object;
  world.loadObjectToCanvas(object);
});

window.addEventListener(EVENTS.SIMULATION.DELETE_OBJECT, (eventData) => {
  let object = eventData.detail.object;
  world.deleteObject(object.id);
});

window.addEventListener(
  EVENTS.SIMULATION.REQUEST_CANVAS_OBJECTS,
  (eventData) => {
    let objectList = world.getCanvasObjects();
    window.dispatchEvent(
      new CustomEvent(EVENTS.SIMULATION.SEND_CANVAS_OBJECTS, {
        detail: { list: objectList, opt: eventData.detail.opt },
      })
    );
  }
);

window.addEventListener(EVENTS.SIMULATION.CLEAR_CANVAS, () => {
  world.clearCanvas();
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
