console.log("hi");

let canvas = new fabric.Canvas("canvas", { backgroundColor: "#8C8C8C" });
canvas.setWidth(window.innerWidth);
canvas.setHeight(window.innerHeight);

addImage("./images/green.png");
addImage("./images/blue.png");
addImage("./images/red.png");
addImage("./images/yellow.png");

/**
 * Fügt ein Bild direkt zum Canvas hinzu
 * @param {string} imgURL URL des Images
 */
function addImage(imgURL) {
  fabric.Image.fromURL(imgURL, function (oImg) {
    canvas.add(oImg);
  });
}
