import { TRAFFIC_SIM } from "../constants.js";
import TrafficMap from "./trafficMap.js";

export default class Tile {
  /**
   * @param {TrafficMap} map
   */
  constructor(map, ix, iy, type, params = {}) {
    this.map = map;
    this.ix = ix;
    this.iy = iy;
    this.direction = { x: 0, y: 0 };
    this.type = type;
    /**@type {Array} */
    this.nextTile = [];
    /**@type {Map} */
    this.vehicles = new Map();
    this.color = "blue";
    this.convertTo(type, params);
    this.realCoords = this.map.getRealCoordinates(ix, iy);
    this.isEnd = false;
    this.displayObject = new fabric.Rect({
      top: this.realCoords.y,
      left: this.realCoords.x,
      width: TRAFFIC_SIM.GRID.RESOLUTION,
      height: TRAFFIC_SIM.GRID.RESOLUTION,
      fill: this.color,
      selectable: false,
    });
  }

  isFreeOf(id, tag) {
    let result = true;
    this.vehicles.forEach((vehicle) => {
      if (vehicle.tag === tag && vehicle.id !== id) {
        result = false;
      }
    });
    return result;
  }

  addVehicle(id, vehicle) {
    // this.displayObject.set("fill", "#6666ff");
    if (!this.vehicles.has(id)) this.vehicles.set(id, vehicle);
  }

  removeVehicle(id) {
    if (this.vehicles.has(id)) this.vehicles.delete(id);
    // if (this.vehicles.size === 0) this.displayObject.set("fill", "#777777");
  }

  /**@return {Array} */
  getNextTiles() {
    return this.nextTile;
  }

  /**@return {Object} */
  getNextTile(index) {
    if (index < 0 || index >= this.nextTile.length) {
      console.error(
        "INDEX " +
          index +
          " von NextTile bei getNextTile nicht im Rahmen des Arrays"
      );
      return false;
    }
    return this.nextTile[index];
  }

  show() {
    if (this.displayObject) {
      this.hide();
    }
    this.displayObject.set("fill", this.color);

    this.map.canvas.add(this.displayObject);
  }

  hide() {
    this.map.canvas.remove(this.displayObject);
  }

  /**
   * @param {String} type Ein Type aus dem TRAFFIC_SIM.TILES Typ
   * @param {Object} params Straße {nextTile: }
   */
  convertTo(type, params = {}) {
    this.type = type;
    switch (this.type) {
      case TRAFFIC_SIM.TILES.EMPTY:
        this.color = "#bbbbbb";
        break;
      case TRAFFIC_SIM.TILES.ROAD:
        this.color = "#777777";
        if (!params) return;
        if (params.nextTile) this.nextTile.push(params.nextTile);
        this.direction = params.direction;
        break;
      case TRAFFIC_SIM.TILES.CROSSING:
        this.color = "#990099";
        if (!params) return;
        if (params.nextTile) this.nextTile.push(params.nextTile);
        this.direction = TRAFFIC_SIM.TILES.CROSSING;
        break;
    }
  }
}
