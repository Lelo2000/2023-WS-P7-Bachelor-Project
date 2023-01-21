import { StreetTile } from "./streetTile.js";

export default class Street {
  constructor(canvas, startPoint, endPoint) {
    this.canvas = canvas;
    this.startPoint = startPoint;
    this.endPoint = endPoint;
    this.streetTiles = [];
    this.id = Math.random();
    this.streetTileSize = 30;
    this.normalVector = { x: 0, y: 0 };
  }

  /**
   * @param {StreetTile} streetTile
   */
  insertStreetTile(streetTile, index) {
    this.streetTiles.splice(index, 0, {
      tile: streetTile,
      normalVector: this.normalVector,
    });
    if (index > 0) {
      this.streetTiles[index - 1].tile.nextTile = [
        { normalVector: this.normalVector, tile: streetTile },
      ];
    }
  }

  createStreetTiles() {
    let deltaX = this.endPoint.x - this.startPoint.x;
    let deltaY = this.endPoint.y - this.startPoint.y;
    let streetLength = Math.sqrt(Math.pow(deltaX, 2) + Math.pow(deltaY, 2));
    let normalX = (1 / streetLength) * deltaX;
    let normalY = (1 / streetLength) * deltaY;
    this.normalVector.x = this.streetTileSize * normalX;
    this.normalVector.y = this.streetTileSize * normalY;
    let stepsNeeded = Math.floor(streetLength / this.streetTileSize) + 1;
    for (let i = 0; i < stepsNeeded; i++) {
      let newX = this.startPoint.x + this.normalVector.x * i;
      let newY = this.startPoint.y + this.normalVector.y * i;
      let streetTile = new StreetTile(newX, newY);
      this.streetTiles.push({
        tile: streetTile,
        normalVector: this.normalVector,
      });
      this.canvas.add(
        new fabric.Rect({
          top: newY,
          left: newX,
          width: 2,
          height: 2,
          fill: "red",
          selectable: false,
        })
      );
    }
    this.streetTiles.forEach((streetTile, index) => {
      if (index === this.streetTiles.length - 1) return;
      streetTile.tile.addNextTile(this.streetTiles[index + 1]);
    });
  }
}
