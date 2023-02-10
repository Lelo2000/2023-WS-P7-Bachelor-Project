export default class heatmapTile {
  constructor(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.id = Math.random();
    this.value = 0;
    this.rect = new fabric.Rect({
      top: this.y,
      left: this.x,
      width: this.width,
      height: this.height,
      fill: "#ff00ff",
      opacity: 0,
      selectable: false,
    });
  }
  updateColor() {
    let color = "";
    if (this.value >= 1 && this.value <= 2)
      color = `rgb(0,${100 * this.value},0)`;
    if (this.value >= 3 && this.value <= 4)
      color = `rgb(0,0,${100 * this.value})`;
    if (this.value >= 5) color = `rgb(${100 * this.value},0,0)`;
    this.rect.set("fill", color);
  }
}
