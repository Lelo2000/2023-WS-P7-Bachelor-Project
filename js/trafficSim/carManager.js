import Car from "./car.js";

export default class CarManager {
  constructor(map) {
    this.map = map;
    /**@type {Map<String, Car>} */
    this.cars = new Map();
    this.pause = false;
    setInterval(() => {
      let rnd = Math.random();
      if (rnd < 0.5) {
        this.spawnCar(20, 1);
      } else {
        this.spawnCar(1, 20);
      }
    }, 300);
  }

  togglePause() {
    this.pause = Math.abs(this.pause - 1);
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

  spawnCar(ix, iy) {
    let tile = this.map.grid[ix][iy];
    let newCar = new Car(tile);
    tile.addVehicle(newCar.id, newCar);
    this.cars.set(newCar.id, newCar);
    return newCar;
  }
}
