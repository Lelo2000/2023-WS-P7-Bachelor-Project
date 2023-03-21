import { TRAFFIC_SIM } from "../../constants.js";
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
    this.content = new Map();
    this.rules = new Map();
    this.affects = [];
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
    // this.displayObject;
  }

  initDisplayObject() {
    return new Promise((resolve) => {
      fabric.Image.fromURL(TRAFFIC_SIM.IMAGES.STREET, (oImg) => {
        oImg.top = this.realCoords.y;
        oImg.left = this.realCoords.x;
        oImg.scaleToWidth(this.map.resolution);
        oImg.scaleToHeight(this.map.resolution);
        oImg.selectable = false;
        oImg.id = this.id;
        this.displayObject = oImg;
        resolve();
      });
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

  async show() {
    if (!this.displayObject) {
      await this.initDisplayObject();
    }
    if (this.type === TRAFFIC_SIM.TILES.EMPTY) {
      return;
    }
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
      case TRAFFIC_SIM.TILES.BESIDE_STREET:
        this.color = "#bbbbff";
        break;
      case TRAFFIC_SIM.TILES.ROAD:
        this.color = "#777777";
        if (!params) return;
        if (params.nextTile) this.addNextTile(params.nextTile);
        this.direction = params.direction;
        break;
      case TRAFFIC_SIM.TILES.CROSSING:
        this.color = "#990099";
        if (!params) return;
        if (params.nextTile) this.addNextTile(params.nextTile);
        this.direction = TRAFFIC_SIM.TILES.CROSSING;
        break;
    }
  }

  addNextTile(nextTile) {
    this.nextTile.push(nextTile);
  }

  applyRule(object, rule) {
    if (Array.isArray(rule)) {
      rule.forEach((rule) => {
        this.rules.set(object.id, rule);
      });
      return;
    }
    this.rules.set(object.id, rule);
  }

  place(object) {
    if (this.content.size < 1) {
      this.content.set(object.id, object);
      if (object.hasCategorie(TRAFFIC_SIM.CATEGORIES.SPEED_SIGN)) {
        TRAFFIC_SIM.CATEGORIES.STREET_SIGNS;
        let tilesAround = this.map.getAllTilesAroundField(this.ix, this.iy);
        tilesAround.forEach((tile) => {
          if (tile.type != TRAFFIC_SIM.TILES.ROAD) return;
          this.affects.push(tile);
          tile.applyRule(object, object.rules);
        });
      }
      return true;
    }
    if (this.content.has(object.id)) {
      return true;
    }
    return false;
  }
  removeContent(object) {
    this.affects.forEach((tile) => {
      if (tile.rules.has(object.id)) tile.rules.delete(object.id);
    });
    this.affects = [];
    if (this.content.has(object.id)) this.content.delete(object.id);
  }
}
