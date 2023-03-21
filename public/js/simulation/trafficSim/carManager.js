import Car from "./car.js";

export default class CarManager {
  constructor(map) {
    this.map = map;
    /**@type {Map<String, Car>} */
    this.cars = new Map();
    this.pause = true;
    this.flow = 100;
    this.spawnInterval;
    this.spawnPoints = [
      { ix: 12, iy: 1 },
      { ix: this.map.iWidth - 1, iy: 10 },
      { ix: 1, iy: 11 },
      { ix: 1, iy: 26 },
      { ix: 23, iy: this.map.iHeight - 1 },
      { ix: 25, iy: 1 },
      { ix: 42, iy: this.map.iHeight - 1 },
    ];
    this.startIntveral();
  }

  startIntveral() {
    if (this.spawnInterval) clearInterval(this.spawnInterval);
    if (this.flow <= 0) return;
    this.spawnInterval = setInterval(() => {
      this.spawnCars();
    }, this.flow);
  }

  spawnCars() {
    if (this.pause) return;
    let rnd = Math.floor(Math.random() * this.spawnPoints.length);
    console.log(rnd);

    this.spawnCar(this.spawnPoints[rnd]);
  }

  moveCars(deltaTime) {
    if (this.pause) return;
    this.cars.forEach((car) => {
      car.drive(deltaTime);
      if (car.tile.isEnd) {
        this.deleteCar(car.id);
      }
    });
  }
  deleteCar(id) {
    this.cars.get(id).destroy();
    this.cars.delete(id);
  }

  spawnCar(point) {
    let ix = point.ix;
    let iy = point.iy;
    let tile = this.map.grid[ix][iy];
    let newCar = new Car(tile);
    tile.addVehicle(newCar.id, newCar);
    this.cars.set(newCar.id, newCar);
    return newCar;
  }
  changeOptions(options) {
    if (options.hasOwnProperty("flow")) {
      this.flow = 60000 / options.flow;
      this.startIntveral();
    }
  }
}
