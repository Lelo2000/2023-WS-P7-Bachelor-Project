import { StreetTile } from "./streetTile.js";

export default class Street {
  constructor(canvas, startPoint, endPoint) {
    this.canvas = canvas;
    this.startPoint = startPoint;
    this.endPoint = endPoint;
    this.streetTiles = [];
    this.drawnTiles = [];
    this.id = Math.random();
    this.streetTileSize = 20;
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
      let getTileBeforeSpacing = this.getSpacingBetweenTiles(index, index - 1);
      if (getTileBeforeSpacing < this.streetTileSize) {
        this.deleteStreetTile(index - 1);
      }
    }
    index = index - 1;
    // if (index + 1 >= this.streetTiles.length) return;
    let getTileAfterSpacing = this.getSpacingBetweenTiles(index + 1, index);
    if (getTileAfterSpacing < this.streetTileSize) {
      this.deleteStreetTile(index + 1);
      console.log("Nächstes Tile zu nahe", getTileAfterSpacing);
    }
  }

  deleteStreetTile(index) {
    console.log(`Straße: ${this.id.toFixed(3)} Tile: ${index} wurde gelöscht`);
    /**@type {StreetTile} */
    let streetTileBefore = this.streetTiles[index - 1];
    streetTileBefore.tile.deleteSpecificNextTile(
      this.streetTiles[index].tile.id
    );
    let streetTilesAfter = this.streetTiles[index].tile.nextTile;
    this.streetTiles.splice(index, 1);
    streetTilesAfter.forEach((tile) => {
      streetTileBefore.tile.addNextTile(tile);
    });
  }

  getSpacingBetweenTiles(indexA, indexB) {
    let tileA = this.streetTiles[indexA];
    let tileB = this.streetTiles[indexB];
    let deltaX = tileA.tile.x - tileB.tile.x;
    let deltaY = tileA.tile.y - tileB.tile.y;
    let distanceBetweenTiles = Math.sqrt(
      Math.pow(deltaX, 2) + Math.pow(deltaY, 2)
    );
    return distanceBetweenTiles;
  }

  draw() {
    this.drawnTiles.forEach((drawnTile) => {
      this.canvas.remove(drawnTile);
    });
    this.drawnTiles = [];
    this.streetTiles.forEach((tile) => {
      let rect = new fabric.Rect({
        top: tile.tile.y,
        left: tile.tile.x,
        width: 2,
        height: 2,
        fill: "red",
        selectable: false,
      });
      this.drawnTiles.push(rect);
      this.canvas.add(rect);
    });
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
      this.draw();
    }
    this.streetTiles.forEach((streetTile, index) => {
      if (index === this.streetTiles.length - 1) return;
      streetTile.tile.addNextTile(this.streetTiles[index + 1]);
    });
  }
}
