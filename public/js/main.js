import World from "./world.js";

const world = new World("simulationCanvas");

$(document).ready(function () {
  $(".button").on("mousedown", function (event) {
    const htmlObj = event.target;
    const objId = htmlObj.id;
    let imgName = objId.split("-")[1];
    world.addImage(`./images/${imgName}.png`, { x: 300, y: 300 }, true);
    console.log(event.target.id);
  });

  $("#toggleHeatmap").click(function (e) {
    e.preventDefault();
    world.toggleHeatmap();
  });
});
