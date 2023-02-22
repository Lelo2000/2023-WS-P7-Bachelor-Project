import { TRAFFIC_SIM } from "../../constants.js";
import Car from "./car.js";
import Tile from "./tile.js";

export default class TrafficMap {
  constructor(canvas) {
    this.canvas = canvas;
    this.resolution = TRAFFIC_SIM.GRID.RESOLUTION;
    this.x = -TRAFFIC_SIM.GRID.RESOLUTION * 3;
    this.y = -TRAFFIC_SIM.GRID.RESOLUTION * 3;
    this.width = this.canvas.width * 2;
    this.height = this.canvas.height * 2;
    this.iWidth = 0;
    this.iHeight = 0;
    this.grid = [];
    this.createGrid();
    this.createRoad({ ix: 0, iy: 15 }, { ix: this.iWidth, iy: 15 });
    this.createRoad({ ix: this.iWidth, iy: 14 }, { ix: 0, iy: 14 });
    this.createRoad({ ix: 15, iy: 0 }, { ix: 15, iy: this.iHeight });
    this.createRoad({ ix: 16, iy: this.iHeight }, { ix: 16, iy: 0 });
    this.createRoad({ ix: 16, iy: 6 }, { ix: this.iWidth, iy: 6 });
    this.createRoad({ ix: 32, iy: 6 }, { ix: 32, iy: 14 });
    console.log(this);
  }

  registerEvents() {
    this.canvas.on("mouse:move", (opt) => {
      let pointer = opt.pointer;
      let iCoordinates = this.getIndexCoordinates(pointer.x, pointer.y);
    });
  }

  createGrid() {
    this.iWidth = Math.floor(this.width / this.resolution + 2);
    this.iHeight = Math.floor(this.height / this.resolution + 2);
    for (let ix = 0; ix < this.iWidth + 1; ix++) {
      this.grid.push([]);
      for (let iy = 0; iy < this.iHeight + 1; iy++) {
        let newGridTile = new Tile(this, ix, iy, TRAFFIC_SIM.TILES.EMPTY);
        if (ix === 0 || ix === this.iWidth || iy === 0 || iy === this.iHeight)
          newGridTile.isEnd = true;
        // newGridTile.show();

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

  getIndexCoordinates(realX, realY) {
    let ixReal = Math.floor((realX - this.x) / this.resolution);
    let iyReal = Math.floor((realY - this.y) / this.resolution);
    return { x: ixReal, y: iyReal };
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
        switch (this.grid[ix][iy].type) {
          case TRAFFIC_SIM.TILES.BESIDE_STREET:
            this.grid[ix][iy].convertTo(TRAFFIC_SIM.TILES.ROAD, {
              nextTile,
              direction: { x: directionX, y: directionY },
            });
            break;
          case TRAFFIC_SIM.TILES.EMPTY:
            this.grid[ix][iy].convertTo(TRAFFIC_SIM.TILES.ROAD, {
              nextTile,
              direction: { x: directionX, y: directionY },
            });
            break;
          case TRAFFIC_SIM.TILES.ROAD:
            this.grid[ix][iy].convertTo(TRAFFIC_SIM.TILES.CROSSING, {
              nextTile,
              direction: { x: directionX, y: directionY },
            });
            break;
        }
        this.markTilesAsBesideStreet(ix, iy);
      }
    }
    this.updateMapTiles();
  }
  updateMapTiles() {
    this.grid.forEach((ixArray) => {
      ixArray.forEach((tile) => {
        tile.show();
      });
    });
  }

  getAllTilesAroundField(ix, iy) {
    let result = [];
    if (iy > 0) {
      result.push(this.grid[ix][iy - 1]);
    }
    if (iy < this.iHeight) {
      result.push(this.grid[ix][iy + 1]);
    }
    if (ix > 0) {
      result.push(this.grid[ix - 1][iy]);
    }
    if (ix < this.iWidth) {
      result.push(this.grid[ix + 1][iy]);
    }
    return result;
  }

  markTilesAsBesideStreet(ix, iy) {
    let tilesToCheck = this.getAllTilesAroundField(ix, iy);

    tilesToCheck.forEach((tile) => {
      if (tile.type != TRAFFIC_SIM.TILES.EMPTY) {
        return;
      }
      tile.convertTo(TRAFFIC_SIM.TILES.BESIDE_STREET);
    });
  }
  getTile(ix, iy) {
    return this.grid[ix][iy];
  }

  logTile(pointer) {
    let iCoordinates = this.getIndexCoordinates(pointer.x, pointer.y);
    console.log("Pointer Debug:", this.grid[iCoordinates.x][iCoordinates.y]);
  }
}
