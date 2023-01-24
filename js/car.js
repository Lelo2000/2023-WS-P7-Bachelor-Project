export default class Car {
  constructor(canvas) {
    this.canvas = canvas;
    this.displayObject = new fabric.Circle({
      top: 0,
      left: 0,
      radius: 6,
      fill: "#ffff00",
      opacity: 0,
      selectable: false,
    });
    this.tag = "car";
    this.id = Math.random();
    this.speed = 1.5;
    this.directionChangeCoolDownMax = 5;
    this.directionChangeCoolDown = 0;
    this.currentStreetTile;
    this.isAtTheEnd = false;
    this.canvas.add(this.displayObject);
  }
  show() {
    this.displayObject.set("opacity", 1);
  }
  hide() {
    this.displayObject.set("opacity", 0);
  }
  moveToStreetTile(streetTile) {
    this.currentStreetTile = streetTile.tile.nextTile[0];
    this.displayObject.set("left", this.currentStreetTile.tile.x);
    this.displayObject.set("top", this.currentStreetTile.tile.y);
    this.canvas.renderAll();
  }

  hasReachedNextTile() {
    let normalX = this.currentStreetTile.normalVector.x;
    let normalY = this.currentStreetTile.normalVector.y;
    if (normalX != 0) {
      if (normalX > 0) {
        if (this.displayObject.left >= this.currentStreetTile.tile.x)
          return true;
      } else if (normalX < 0) {
        if (this.displayObject.left <= this.currentStreetTile.tile.x)
          return true;
      }
    }
    if (normalY != 0) {
      if (normalY > 0) {
        if (this.displayObject.top >= this.currentStreetTile.tile.y)
          return true;
      } else if (normalY < 0) {
        if (this.displayObject.top <= this.currentStreetTile.tile.y)
          return true;
      }
    }
    if (
      this.displayObject.left === this.currentStreetTile.tile.x &&
      this.displayObject.top === this.currentStreetTile.tile.y
    )
      return true;
    return false;
  }

  correctCoordinates() {
    if (this.currentStreetTile.normalVector.x === 0) {
      this.displayObject.set("left", this.currentStreetTile.tile.x);
    }
    if (this.currentStreetTile.normalVector.y === 0) {
      this.displayObject.set("top", this.currentStreetTile.tile.y);
    }
    console.log(
      this.id.toFixed(4),
      this.displayObject.left,
      this.displayObject.top
    );
  }

  drive() {
    if (this.hasReachedNextTile()) {
      this.correctCoordinates();
      if (!this.decideNextTile()) {
        console.log("Weg Blockiert");
        return;
      }
    }
    let x = this.displayObject.left;
    let y = this.displayObject.top;

    if (x != this.currentStreetTile.tile.x) {
      x += this.currentStreetTile.normalVector.x * this.speed;
    }
    if (y != this.currentStreetTile.tile.y) {
      y += this.currentStreetTile.normalVector.y * this.speed;
    }
    this.displayObject.set("left", x);
    this.displayObject.set("top", y);

    // this.displayObject.animate(
    //   { left: this.currentStreetTile.x, top: this.currentStreetTile.y },
    //   {
    //     duration: 2000,
    //     easing: fabric.util.ease.linear,
    //     onComplete: () => {
    //       let lastTile = this.currentStreetTile;
    //       this.decideNextTile();
    //       if (this.currentStreetTile.id != lastTile.id) this.startDriving();
    //     },
    //   }
    // );
  }

  decideNextTile() {
    let numberOfNextTiles = this.currentStreetTile.tile.nextTile.length;
    let nextTile;
    let oldTile = this.currentStreetTile;
    let oldNormVector = oldTile.normalVector;
    if (numberOfNextTiles === 0) {
      oldTile.tile.removeOccupant(this.id, this);
      this.isAtTheEnd = true;
      return false;
    }
    if (this.directionChangeCoolDown === 0) {
      let nextIndex = Math.floor(Math.random() * numberOfNextTiles);
      nextTile = this.currentStreetTile.tile.nextTile[nextIndex];
    } else {
      nextTile = this.currentStreetTile.tile.nextTile.find(
        (obj) =>
          obj.normalVector.x === oldNormVector.x &&
          obj.normalVector.y === oldNormVector.y
      );
    }

    let tryToOccupie = nextTile.tile.tryToOccupie(this.id, this);
    if (tryToOccupie) {
      oldTile.tile.removeOccupant(this.id, this);
      this.currentStreetTile = nextTile;

      if (this.directionChangeCoolDown > 0) {
        this.directionChangeCoolDown--;
      }
      if (oldNormVector != this.currentStreetTile.normalVector) {
        this.directionChangeCoolDown = this.directionChangeCoolDownMax;
      }
    } else {
      this.canvas.renderAll();
      this.speed = nextTile.tile.getOccupants(this.tag)[0].speed;
      this.currentStreetTile = oldTile;
    }
    return true;
  }

  checkForSpeedLimit() {
    let speedLimit = this.currentStreetTile.tile.getSpeedLimit();
    if (speedLimit) {
      this.speed = this.currentStreetTile.tile.getSpeedLimit();
    }
  }
}
