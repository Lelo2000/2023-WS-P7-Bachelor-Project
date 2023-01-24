import Heatmap from "./heatmap.js";
import { Object } from "./object.js";
import TrafficMap from "./trafficSim/grid.js";
export default class World {
  /**
   * @constructor
   * @param htmlAnchorId ID des HTML Elements, in welchem die World verankert sein soll.
   */
  constructor(htmlAnchorId) {
    this.canvas = new fabric.Canvas(htmlAnchorId, {
      backgroundColor: "#8C8C8C",
    });

    /**@type {Map} Eine Map mit allen Objekten, welche auf dem Canvas platziert wurden*/
    this.objectList = new Map();
    this.setupCanvas();
    this.errorText = new fabric.Text("", {
      fill: "red",
      top: 0,
      left: this.canvas.width,
      originX: "right",
      hasControls: false,
      selectable: false,
    });
    this.canvas.add(this.errorText);
    this.heatMap = new Heatmap(this.canvas, this.objectList);
    this.heatMap.createHeatmap();
    /**@type {TrafficMap} */
    this.map = new TrafficMap(this.canvas);
    // this.car.startDriving();
    this.render();
  }
  render() {
    this.canvas.renderAll();
    window.requestAnimationFrame(() => {
      this.render();
    });
  }

  toggleHeatmap() {
    if (this.heatMap.isVisible) {
      this.heatMap.hide();
      return;
    }
    this.heatMap.show();
  }

  /**
   * Fügt ein Bild direkt zum Canvas hinzu
   * @param {string} imgURL URL des Images
   * @param {object} position Position bei der das Bild hinzugefügt werden soll. Standard: {x: 0, y: 0}
   * @param {boolean} center Ob das Bild um position zentriert sein soll. Standard: false
   */
  addImage(imgURL, position = { x: 0, y: 0 }, center = false) {
    fabric.Image.fromURL(imgURL, (oImg) => {
      console.log(oImg);
      if (center) {
        oImg.top = position.y - oImg.height / 2;
        oImg.left = position.x - oImg.width / 2;
      } else {
        oImg.top = position.y;
        oImg.left = position.x;
      }

      this.canvas.add(oImg);
      oImg.lockScalingX = true;
      oImg.lockScalingY = true;
      oImg.setControlsVisibility({
        mt: false,
        mb: false,
        ml: false,
        mr: false,
        bl: false,
        br: false,
        tl: false,
        tr: false,
        mtr: true,
      });
      this.canvas.setActiveObject(oImg);
      let newObject = new Object(oImg);
      oImg.id = newObject.id;
      console.log(oImg);
      this.objectList.set(newObject.id, newObject);
    });
  }

  setupCanvas() {
    this.canvas.setWidth(window.innerWidth);
    this.canvas.setHeight(window.innerHeight);

    this.canvas.on({
      "object:moving": (options) => {
        this.onChange(options);
      },
      "object:scaling": (options) => {
        this.onChange(options);
      },
      "object:rotating": (options) => {
        this.onChange(options);
      },
    });
  }

  onChange(options) {
    if (!options.target.id) {
      return;
    }
    options.target.setCoords();
    let movedObjectId = options.target.id;
    let movedObject = this.objectList.get(movedObjectId);
    let copyObjectList = new Map(this.objectList);
    let collidedObjects = [];

    copyObjectList.delete(movedObjectId);
    copyObjectList.forEach((object, key) => {
      let displayObject = object.displayObject;
      if (options.target.intersectsWithObject(displayObject)) {
        collidedObjects.push(displayObject.id);
      }
    });

    collidedObjects.forEach((id) => {
      movedObject.onCollision(id);
    });

    collidedObjects.forEach((id) => {
      this.objectList.get(id).onCollision(movedObjectId);
      copyObjectList.delete(id);
    });

    copyObjectList.forEach((object) => {
      object.endCollision(movedObjectId);
      movedObject.endCollision(object.id);
    });
    this.checkForErrors();
    if (this.heatMap.isVisible) {
      this.heatMap.colorHeatmap();
    }
  }

  checkForErrors() {
    let wasCollision = false;

    this.objectList.forEach((obj) => {
      if (obj.isCollided) {
        wasCollision = true;
      }
    });
    if (wasCollision) {
      this.errorText.set("text", "Die Objekte dürfen sich nicht überlagern");
      return;
    }
    this.errorText.set("text", "");
  }
}
