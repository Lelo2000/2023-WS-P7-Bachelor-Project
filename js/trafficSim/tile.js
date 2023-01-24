import { TRAFFIC_SIM } from "../constants.js";
import TrafficMap from "./grid.js";

export default class Tile {
  /**
   * @param {TrafficMap} map
   */
  constructor(map, ix, iy, type) {
    this.map = map;
    this.ix = ix;
    this.iy = iy;
    this.type = type;
    /**@type {Array} */
    this.nextTile = [];
    /**@type {Array} */
    this.vehicles = [];
    this.color = "blue";
    this.realCoords = this.map.getRealCoordinates(ix, iy);
    this.displayObject;
  }

  show() {
    if (this.displayObject) {
      this.hide();
    }
    switch (this.type) {
      case TRAFFIC_SIM.TILES.EMPTY:
        this.color = "#bbbbbb";
        break;
      case TRAFFIC_SIM.TILES.ROAD:
        this.color = "#777777";
    }
    this.displayObject = new fabric.Rect({
      top: this.realCoords.y,
      left: this.realCoords.x,
      width: TRAFFIC_SIM.GRID.RESOLUTION,
      height: TRAFFIC_SIM.GRID.RESOLUTION,
      fill: this.color,
      selectable: false,
    });
    this.map.canvas.add(this.displayObject);
  }
  hide() {
    this.map.canvas.remove(this.displayObject);
  }
}
