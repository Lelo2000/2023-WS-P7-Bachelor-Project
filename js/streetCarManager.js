import Car from "./car.js";
import Street from "./street.js";

export default class StreetCarManager {
  constructor(canvas) {
    this.canvas = canvas;
    this.streets = [];
    this.cars = [];
    this.addStreet({ x: 400, y: 0 }, { x: 400, y: this.canvas.height });
    this.addStreet({ x: 0, y: 400 }, { x: this.canvas.width, y: 400 });
    this.addCar(this.streets[0]);
    this.addCar(this.streets[1]);
  }
  addStreet(startPoint, endPoint) {
    let newStreet = new Street(this.canvas, startPoint, endPoint);
    newStreet.createStreetTiles();
    this.streets.push(newStreet);
  }
  addCar(startStreet) {
    let newCar = new Car(this.canvas);
    newCar.moveToStreetTile(startStreet.streetTiles[0]);
    newCar.show();
    this.cars.push(newCar);
  }
  driveCars() {
    this.cars.forEach((car) => {
      car.drive();
    });
  }
}
