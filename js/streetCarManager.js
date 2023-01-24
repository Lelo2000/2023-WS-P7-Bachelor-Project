import Car from "./car.js";
import Street from "./street.js";
import { StreetTile } from "./streetTile.js";

export default class StreetCarManager {
  constructor(canvas) {
    this.canvas = canvas;
    this.streets = [];
    this.cars = new Map();
    this.addStreet({ x: 400, y: 0 }, { x: 400, y: this.canvas.height });
    this.addStreet({ x: 420, y: this.canvas.height }, { x: 420, y: 0 });
    this.addStreet({ x: 0, y: 400 }, { x: this.canvas.width, y: 400 });
    this.addStreet({ x: this.canvas.width, y: 420 }, { x: 0, y: 420 });

    setInterval(() => {
      this.spawnCar();
    }, 500);
    this.crossings = [];
    this.createCrossings();
    this.linkStreetsOnIntersections();
    this.maxCars = 30;
    // this.streets[0].streetTiles[20].tile.getOccupied("asfas", { tag: "car" });
    // console.log("Street 0: ", this.streets[0]);
    // console.log("Street 2: ", this.streets[2]);
    // console.log("search for sheets");
    // this.streets[0].streetTiles.forEach((element, index) => {
    //   if (element.tile.x === 400 && element.tile.y === 400) {
    //     console.log(index);
    //   }
    // });
    // this.streets[2].streetTiles.forEach((element, index) => {
    //   if (element.tile.x === 400 && element.tile.y === 400) {
    //     console.log(index);
    //   }
    // });
    this.pause = false;
  }

  togglePause() {
    this.pause = Math.abs(this.pause - 1);
  }

  createCrossings() {
    this.streets.forEach((streetA) => {
      this.streets.forEach((streetB) => {
        if (streetA.id === streetB.id) return;
        let intersection = this.intersection(
          streetA.normalVector,
          streetB.normalVector,
          streetA.startPoint,
          streetB.startPoint
        );
        if (intersection === null) return;
        intersection = {
          x: Math.round(intersection.x),
          y: Math.round(intersection.y),
          streetA: streetA,
          streetB: streetB,
        };
        let isDouble = false;
        this.crossings.forEach((crossOver) => {
          if (
            crossOver.x === intersection.x &&
            crossOver.y === intersection.y
          ) {
            isDouble = true;
          }
        });
        if (isDouble) return;
        this.crossings.push(intersection);
        console.log("create Crossing");
        let circle = new fabric.Circle({
          top: intersection.y,
          left: intersection.x,
          radius: 4,
          fill: "#ff22ff",
          originX: "center",
          originY: "center",
        });
        this.canvas.add(circle);
      });
    });
    console.log("Crossings: ", this.crossings);
  }

  spawnCar() {
    if (this.pause) return;
    if (this.cars.size < this.maxCars) {
      let randomIndex = Math.floor(Math.random() * this.streets.length);
      this.addCar(this.streets[randomIndex]);
      console.log(this.cars);
    }
  }

  driveCars() {
    if (this.pause) return;
    this.cars.forEach((car) => {
      car.drive();
      if (car.isAtTheEnd) {
        this.deleteCar(car);
      }
    });
  }

  linkStreetsOnIntersections() {
    this.crossings.forEach((crossing) => {
      /**@type {Street} street */
      let streetA = crossing.streetA;
      let streetB = crossing.streetB;
      let streetTileIndexA = this.getStreetTileBeforeAPoint(streetA, crossing);
      let streetTileIndexB = this.getStreetTileBeforeAPoint(streetB, crossing);
      console.log("Create Crossing Tile");
      let crossingTile = new StreetTile(crossing.x, crossing.y);
      crossingTile.name = "JEAAAAAAAAAAAAAAAAAAAAAAAA";
      crossingTile.addNextTile(streetA.streetTiles[streetTileIndexA + 1]);
      crossingTile.addNextTile(streetB.streetTiles[streetTileIndexB + 1]);
      streetA.insertStreetTile(crossingTile, streetTileIndexA + 1);
      streetB.insertStreetTile(crossingTile, streetTileIndexB + 1);
      streetA.draw();
      streetB.draw();
      //   console.log(streetTileIndexA, streetTileIndexB);
      //   console.log(
      //     "Tile vor der Kreuzung StreetA",
      //     streetA.streetTiles[streetTileIndexA]
      //   );
      //   console.log("Tile nach der Kreuzung StreetB");
    });
  }

  /**@param {Street} street */
  getStreetTileBeforeAPoint(street, point) {
    let startPoint = street.startPoint;
    let index = -1;
    if (street.normalVector.x != 0) {
      index =
        (point.x - startPoint.x) /
        (street.normalVector.x * street.streetTileSize);
    } else if (street.normalVector.y != 0) {
      index =
        (point.y - startPoint.y) /
        (street.normalVector.y * street.streetTileSize);
    }
    return Math.floor(index);
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
    this.cars.set(newCar.id, newCar);
  }

  deleteCar(car) {
    this.canvas.remove(car.displayObject);
    this.cars.delete(car.id);
  }
  intersection(vector1, vector2, start1, start2) {
    let x1 = start1.x,
      y1 = start1.y,
      x2 = vector1.x + x1,
      y2 = vector1.y + y1;
    let x3 = start2.x,
      y3 = start2.y,
      x4 = vector2.x + x3,
      y4 = vector2.y + y3;
    let denom = (y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1);
    let ua = ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) / denom;
    let ub = ((x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)) / denom;
    let x = x1 + ua * (x2 - x1);
    let y = y1 + ua * (y2 - y1);
    if (ua > 0 && ub > 0) {
      return { x: x, y: y };
    } else {
      return null;
    }
  }
}
