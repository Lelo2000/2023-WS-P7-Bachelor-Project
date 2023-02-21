import { TRAFFIC_SIM } from "../../constants.js";
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
    this.tag = TRAFFIC_SIM.VEHICLES.CAR;
    this.displayObject;
    this.initDisplayObject();
    this.size = { x: 30, y: 35 };
    this.progressToNextTile = 0;
    this.updateDistnaceToCover();
  }

  initDisplayObject() {
    fabric.Image.fromURL(TRAFFIC_SIM.IMAGES.CAR, (oImg) => {
      oImg.top = this.tile.realCoords.y + this.size.y / 2;
      oImg.left = this.tile.realCoords.x + this.size.x / 2;
      oImg.scaleToWidth(this.size.x);
      oImg.scaleToHeight(this.size.y);
      oImg.set("originX", "center");
      oImg.set("originY", "center");
      oImg.selectable = false;
      oImg.id = this.id;
      this.displayObject = oImg;
      this.tile.map.canvas.add(oImg);
    });
  }

  decideNextTile() {
    if (this.nextTile) {
      this.tile.removeVehicle(this.id);
      this.tile = this.nextTile;
      this.tile.addVehicle(this.id, this);
      let tileRules = Array.from(this.tile.rules.values());
      if (tileRules.length != 0) {
        tileRules.forEach((tileRule) => {
          switch (tileRule.type) {
            case TRAFFIC_SIM.STREET_RULES.SPEED: {
              this.speed = tileRule.value;
            }
          }
        });
      }
    }
    /**@type {Tile} */
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
          nextTile = this.tile.getNextTile(randomIndex);
      }
      if (nextTile && nextTile.isFreeOf(this.id, this.tag)) {
        this.nextTile = nextTile;
        this.nextTile.addVehicle(this.id, this);
        this.progressToNextTile = 0;
      } else {
        // let otherTileVehicles = Array.from(nextTile.vehicles.values());
        // otherTileVehicles.forEach((vehicle) => {
        //   this.speed = vehicle.speed;
        // });
      }
      this.updateDistnaceToCover();
    }
  }
  updateDistnaceToCover() {
    this.distanceToCoverX = this.nextTile.realCoords.x - this.tile.realCoords.x;
    this.distanceToCoverY = this.nextTile.realCoords.y - this.tile.realCoords.y;
    if (!this.displayObject) return;
    if (this.distanceToCoverX > 0) {
      this.displayObject.set("angle", 90);
    } else if (this.distanceToCoverX < 0) {
      this.displayObject.set("angle", 270);
    }
    if (this.distanceToCoverY > 0) {
      this.displayObject.set("angle", 180);
    } else if (this.distanceToCoverY < 0) {
      this.displayObject.set("angle", 0);
    }
  }

  drive(deltaTime) {
    if (!this.displayObject) {
      return;
    }
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
      this.tile.realCoords.x +
        this.distanceToCoverX * this.progressToNextTile +
        this.size.x / 2
    );
    this.displayObject.set(
      "top",
      this.tile.realCoords.y +
        this.distanceToCoverY * this.progressToNextTile +
        this.size.y / 2
    );
  }

  destroy() {
    this.tile.removeVehicle(this.id);
    this.tile.map.canvas.remove(this.displayObject);
  }
}
