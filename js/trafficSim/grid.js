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
    console.log(this);
    this.createRoad({ ix: 0, iy: 20 }, { ix: this.iWidth, iy: 20 });
  }

  createGrid() {
    this.iWidth = Math.floor(this.canvas.width / this.resolution + 2);
    this.iHeight = Math.floor(this.canvas.height / this.resolution + 2);
    for (let ix = 0; ix < this.iWidth + 1; ix++) {
      this.grid.push([]);
      for (let iy = 0; iy < this.iHeight + 1; iy++) {
        let newGridTile = new Tile(this, ix, iy, TRAFFIC_SIM.TILES.EMPTY);
        if (ix === 0 || ix === this.iWidth || iy === 0 || iy === this.iHeight)
          newGridTile.isEnd = true;
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
    let directionX = iStart.ix > iEnd.ix ? -1 : 1;
    let directionY = iStart.iy > iEnd.iy ? -1 : 1;
    const stepsX = Math.abs(iEnd.ix - iStart.ix);
    const stepsY = Math.abs(iEnd.iy - iStart.iy);
    if (stepsX === 0) directionX = 0;
    if (stepsY === 0) directionY = 0;

    console.log(directionX, directionY);
    console.log(stepsX, stepsY);
    for (let nx = 0; nx <= stepsX; nx++) {
      let ix = nx * directionX + iStart.ix;
      for (let ny = 0; ny <= stepsY; ny++) {
        let iy = ny * directionY + iStart.iy;
        let nextTile = undefined;
        let nextIx = ix + directionX;
        let nextIy = iy + directionY;
        if (
          nextIx <= this.iWidth &&
          nextIx >= 0 &&
          nextIy <= this.iHeight &&
          nextIy >= 0
        )
          nextTile = this.grid[ix + directionX][iy + directionY];
        this.grid[ix][iy].convertTo(TRAFFIC_SIM.TILES.ROAD, { nextTile });
        this.grid[ix][iy].show();
      }
    }
  }
}
