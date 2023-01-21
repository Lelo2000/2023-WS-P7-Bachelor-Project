export class StreetTile {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.id = Math.random();
    this.nextTile = [];
    this.occupants = new Map();
    this.occupantsCount = { car: 0 };
    this.occupantsMax = { car: 1 };
  }

  tryToOccupie(id, occupant) {
    if (this.occupantsCount[occupant.tag] >= this.occupantsMax[occupant.tag]) {
      return false;
    }
    this.getOccupied(id, occupant);
    return true;
  }

  removeOccupant(id, occupant) {
    this.occupant.delete(id);
    this.occupantsCount[occupant.tag]--;
  }

  getOccupied(id, occupant) {
    this.occupant.set(id, occupant);
    this.occupantsCount[occupant.tag]++;
  }

  addNextTile(streetTile) {
    this.nextTile.push(streetTile);
  }
}
