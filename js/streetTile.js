export class StreetTile {
  constructor(x, y, streets) {
    this.x = x;
    this.y = y;
    this.id = Math.random();
    this.nextTile = [];
    this.occupant = [];
    this.streets = [];
  }
  addNextTile(streetTile) {
    this.nextTile.push(streetTile);
  }
}
