export default class Car {
  constructor(canvas) {
    this.canvas = canvas;
    this.displayObject = new fabric.Circle({
      top: 0,
      left: 0,
      radius: 15,
      fill: "#ffff00",
      opacity: 0,
      selectable: false,
    });
    this.speed = 0.1;
    this.currentStreetTile;
    this.canvas.add(this.displayObject);
  }
  show() {
    this.displayObject.set("opacity", 1);
  }
  hide() {
    this.displayObject.set("opacity", 0);
  }
  moveToStreetTile(streetTile) {
    this.currentStreetTile = streetTile;
    console.log(this.currentStreetTile);
    console.log(this.currentStreetTile);
    this.displayObject.set("left", this.currentStreetTile.tile.x);
    this.displayObject.set("top", this.currentStreetTile.tile.y);
    this.canvas.renderAll();
  }

  drive() {
    let x = this.displayObject.left;
    let y = this.displayObject.top;

    let deltaAllowed = 1;
    if (
      x > this.currentStreetTile.tile.x - deltaAllowed &&
      x < this.currentStreetTile.tile.x + deltaAllowed &&
      y > this.currentStreetTile.tile.y - deltaAllowed &&
      y < this.currentStreetTile.tile.y + deltaAllowed
    ) {
      if (!this.decideNextTile()) return;
    }

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
    if (this.currentStreetTile.tile.nextTile.length == 0) return false;
    this.currentStreetTile = this.currentStreetTile.tile.nextTile[0];
  }
}
