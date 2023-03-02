import { TRAFFIC_SIM } from "../../constants.js";
import Car from "./car.js";
import Tile from "./tile.js";

export default class TrafficMap {
  constructor(canvas) {
    this.canvas = canvas;
    this.resolution = TRAFFIC_SIM.GRID.RESOLUTION;
    this.x = -TRAFFIC_SIM.GRID.RESOLUTION * 3;
    this.y = -TRAFFIC_SIM.GRID.RESOLUTION * 3;
    this.width = 2520 + 60 * 3;
    this.height = 1860 + 60 * 3;
    this.iWidth = 0;
    this.iHeight = 0;
    this.grid = [];
    this.createGrid();
    this.createRoad({ ix: 12, iy: 0 }, { ix: 12, iy: 26 });
    this.createRoad({ ix: 13, iy: 26 }, { ix: 13, iy: 0 });

    this.createRoad({ ix: this.iWidth, iy: 10 }, { ix: 0, iy: 10 });
    this.createRoad({ ix: 0, iy: 11 }, { ix: this.iWidth, iy: 11 });

    this.createRoad({ ix: 23, iy: 25 }, { ix: 0, iy: 25 });
    this.createRoad({ ix: 0, iy: 26 }, { ix: 22, iy: 26 });

    this.createRoad({ ix: 22, iy: 26 }, { ix: 22, iy: this.iHeight });
    this.createRoad({ ix: 23, iy: this.iHeight }, { ix: 23, iy: 25 });

    this.createRoad({ ix: 25, iy: 0 }, { ix: 25, iy: 11 });
    this.createRoad({ ix: 26, iy: 11 }, { ix: 26, iy: 0 });

    this.createRoad({ ix: 41, iy: 10 }, { ix: 41, iy: this.iHeight });
    this.createRoad({ ix: 42, iy: this.iHeight }, { ix: 42, iy: 10 });

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
