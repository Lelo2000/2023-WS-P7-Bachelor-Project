import heatmapTile from "./heatmapTile.js";

export default class Heatmap {
  constructor(canvas, objectList) {
    this.canvas = canvas;
    this.objectList = objectList;
    this.height = canvas.height;
    this.width = canvas.width;
    this.resolutionX = 100;
    this.resolutionY = 100;
    this.tiles = [];
    this.isVisible = false;
  }

  show() {
    this.tiles.forEach((row) => {
      row.forEach((tile) => {
        tile.rect.set("opacity", 0.5);
      });
    });
    this.isVisible = true;
    this.colorHeatmap();
    this.canvas.renderAll();
  }

  hide() {
    this.tiles.forEach((row) => {
      row.forEach((tile) => {
        tile.rect.set("opacity", 0);
      });
    });
    this.canvas.renderAll();
    this.isVisible = false;
  }
  createHeatmap() {
    let stepsX = this.width / this.resolutionX;
    let stepsY = this.height / this.resolutionY;
    for (let iX = 0; iX < this.resolutionX; iX++) {
      this.tiles[iX] = [];
      for (let iY = 0; iY < this.resolutionY; iY++) {
        let newRect = new heatmapTile(stepsX * iX, stepsY * iY, stepsX, stepsY);
        this.canvas.add(newRect.rect);
        this.tiles[iX].push(newRect);
      }
    }
    console.log(this.tiles);
  }
  colorHeatmap() {
    this.tiles.forEach((row) => {
      row.forEach((tile) => {
        tile.value = 0;
        this.objectList.forEach((object) => {
          object.displayObject.originX = "center";
          object.displayObject.originY = "center";
          object.displayObject.scale(2, 2);
          object.displayObject.setCoords();
          if (tile.rect.intersectsWithObject(object.displayObject)) {
            tile.value++;
          }
          object.displayObject.scale(1, 1);
          object.displayObject.setCoords();
        });

        tile.updateColor();
      });
    });
  }
}
