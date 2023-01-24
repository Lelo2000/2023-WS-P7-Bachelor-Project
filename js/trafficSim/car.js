import { TRAFFIC_SIM } from "../constants.js";
import Tile from "./tile.js";

export default class Car {
  /**@param {Tile} tile*/
  constructor(tile) {
    this.tile = tile;
    this.nextTile = tile.getNextTile(0);
    this.ix = tile.ix;
    this.iy = tile.iy;
    this.speed = 0.2;
    this.id = Math.random();
    this.displayObject = new fabric.Circle({
      left: tile.realCoords.x,
      top: tile.realCoords.y,
      radius: 5,
      fill: "#77ff77",
      selectable: false,
    });
    tile.map.canvas.add(this.displayObject);
    this.progressToNextTile = 0;
    this.updateDistnaceToCover();
  }

  decideNextTile() {
    if (this.nextTile) {
      this.tile = this.nextTile;
    }
    let nextTile;
    if (this.tile.nextTile.length > 0) {
      switch (this.tile.type) {
        case TRAFFIC_SIM.TILES.ROAD:
          nextTile = this.tile.getNextTile(0);
          break;
        case TRAFFIC_SIM.TILES.CROSSING:
          let randomIndex = Math.floor(
            Math.random() * this.tile.nextTile.length
          );
          console.log(randomIndex);
          nextTile = this.tile.getNextTile(randomIndex);
      }
      if (nextTile) this.nextTile = nextTile;
      this.progressToNextTile = 0;
      this.updateDistnaceToCover();
    }
  }
  updateDistnaceToCover() {
    this.distanceToCoverX = this.nextTile.realCoords.x - this.tile.realCoords.x;
    this.distanceToCoverY = this.nextTile.realCoords.y - this.tile.realCoords.y;
  }

  drive(deltaTime) {
    if (!this.nextTile) {
      this.decideNextTile();
    }
    if (this.progressToNextTile >= 1) {
      this.decideNextTile();
    }

    this.progressToNextTile += this.speed;
    // console.log("deltaTime: ", deltaTime);
    // console.log("Progress: ", this.progressToNextTile);
    this.displayObject.set(
      "left",
      this.tile.realCoords.x + this.distanceToCoverX * this.progressToNextTile
    );
    this.displayObject.set(
      "top",
      this.tile.realCoords.y + this.distanceToCoverY * this.progressToNextTile
    );
  }

  destroy() {
    this.tile.map.canvas.remove(this.displayObject);
  }
}
