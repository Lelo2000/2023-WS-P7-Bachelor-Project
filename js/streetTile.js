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

  deleteSpecificNextTile(id) {
    this.nextTile.forEach((tile, index) => {
      if (tile.id === id) {
        this.nextTile.splice(index, 1);
      }
    });
  }

  tryToOccupie(id, occupant) {
    if (this.occupantsCount[occupant.tag] >= this.occupantsMax[occupant.tag]) {
      return false;
    }
    this.getOccupied(id, occupant);
    return true;
  }

  getOccupants(occupantTag) {
    let occupants = [];
    this.occupants.forEach((occupant) => {
      if (occupant.tag === occupantTag) {
        occupants.push(occupant);
      }
    });
    return occupants;
  }

  removeOccupant(id, occupant) {
    this.occupants.delete(id);
    this.occupantsCount[occupant.tag]--;
  }

  getOccupied(id, occupant) {
    this.occupants.set(id, occupant);
    this.occupantsCount[occupant.tag]++;
  }

  addNextTile(streetTile) {
    this.nextTile.push(streetTile);
  }
}
