import { TRAFFIC_SIM } from "../constants.js";
import Tile from "./tile.js";

export default class TrafficMap {
  constructor(canvas) {
    this.canvas = canvas;
    this.resolution = TRAFFIC_SIM.GRID.RESOLUTION;
    this.x = -TRAFFIC_SIM.GRID.RESOLUTION;
    this.y = -TRAFFIC_SIM.GRID.RESOLUTION;
    this.iWidth = 0;
    this.iHeight = 0;
    this.grid = [];
    this.createGrid();
    this.createRoad({ ix: 0, iy: 0 }, { ix: 10, iy: 10 });
    this.createRoad({ ix: 10, iy: 10 }, { ix: 0, iy: 0 });
  }
  createGrid() {
    this.iWidth = Math.floor(this.canvas.width / this.resolution + 2);
    this.iHeight = Math.floor(this.canvas.height / this.resolution + 2);
    for (let ix = 0; ix < this.iWidth; ix++) {
      this.grid.push([]);
      for (let iy = 0; iy < this.iHeight; iy++) {
        let newGridTile = new Tile(this, ix, iy, TRAFFIC_SIM.TILES.EMPTY);
        newGridTile.show();

        this.grid[ix].push(newGridTile);
      }
    }
  }

  /**
   * Rechent Indizes in echte Canvas koordinaten um
   * @param {number} ix
   * @param {number} iy
   */
  getRealCoordinates(ix, iy) {
    return {
      x: this.x + this.resolution * ix,
      y: this.y + this.resolution * iy,
    };
  }

  /**
   * @param {Object} iStart {ix: 0, iy: 0}
   * @param {Object} iEnd {ix: 0, iy: 0}
   */
  createRoad(iStart, iEnd) {
    const directionX = iStart.ix > iEnd.ix ? -1 : 1;
    const directionY = iStart.iy > iEnd.iy ? -1 : 1;
    console.log(directionX, directionY);
    for (let ix = iStart; ix != iEnd.ix; ix += directionX) {
      for (let iy = iStart; iy != iEnd.iy; iy += directiony) {
        console.log(ix, iy);
      }
    }
  }
}
