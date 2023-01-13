import { Object } from "./object.js";

/**@type {Map} Eine Map mit allen Objekten, welche auf dem Canvas platziert wurden*/
const objectList = new Map();

$(document).ready(function () {
  $(".button").on("mousedown", function (event) {
    const htmlObj = event.target;
    const objId = htmlObj.id;
    let imgName = objId.split("-")[1];
    addImage(`./images/${imgName}.png`, { x: 300, y: 300 }, true);
    console.log(event.target.id);
  });
});

const canvas = new fabric.Canvas("simulationCanvas", {
  backgroundColor: "#8C8C8C",
});
setupCanvas();

/**
 * Fügt ein Bild direkt zum Canvas hinzu
 * @param {string} imgURL URL des Images
 * @param {object} position Position bei der das Bild hinzugefügt werden soll. Standard: {x: 0, y: 0}
 * @param {boolean} center Ob das Bild um position zentriert sein soll. Standard: false
 */
function addImage(imgURL, position = { x: 0, y: 0 }, center = false) {
  fabric.Image.fromURL(imgURL, function (oImg) {
    console.log(oImg);
    if (center) {
      oImg.top = position.y - oImg.height / 2;
      oImg.left = position.x - oImg.width / 2;
    } else {
      oImg.top = position.y;
      oImg.left = position.x;
    }
    canvas.add(oImg);
    canvas.setActiveObject(oImg);
    let newObject = new Object(oImg);
    oImg.id = newObject.id;
    console.log(oImg);
    objectList.set(newObject.id, newObject);
  });
}

function setupCanvas() {
  canvas.setWidth(window.innerWidth);
  canvas.setHeight(window.innerHeight);

  canvas.on({
    "object:moving": onChange,
    "object:scaling": onChange,
    "object:rotating": onChange,
  });
}

function onChange(options) {
  console.log(options);
  if (!options.target.id) {
    return;
  }
  options.target.setCoords();
  let movedObjectId = options.target.id;
  let movedObject = objectList.get(movedObjectId);
  let copyObjectList = new Map(objectList);
  let collidedObjects = [];

  copyObjectList.delete(movedObjectId);
  copyObjectList.forEach((object, key) => {
    let displayObject = object.displayObject;
    if (options.target.intersectsWithObject(displayObject)) {
      collidedObjects.push(displayObject.id);
    }
  });

  collidedObjects.forEach((id) => {
    movedObject.onCollision(id);
  });

  collidedObjects.forEach((id) => {
    objectList.get(id).onCollision(movedObjectId);
    copyObjectList.delete(id);
  });

  copyObjectList.forEach((object) => {
    object.endCollision(movedObjectId);
    movedObject.endCollision(object.id);
  });
}

// /**
//  * Gibt die aktuelle Position der Maus relativ zum Canvas aus.
//  */

// function getMousePositionOnCanvas(event) {
//   console.log("X: " + event.clientX + ", Y: " + event.clientY);
//   let mouseX = event.clientX;
//   let mouseY = event.clientY;
//   let canvas = $("#simulationCanvas").offset();

//   let returnValue = { x: mouseX, y: mouseY };
//   if (canvas.top > mouseY) returnValue.y = 0;
//   if (canvas.left > mouseX) returnValue.x = 0;
//   return returnValue;
// }
