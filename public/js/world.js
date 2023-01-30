import { EVENTS } from "./constants.js";
import Heatmap from "./heatmap.js";
import { Object } from "./object.js";
import CarManager from "./trafficSim/carManager.js";
import TrafficMap from "./trafficSim/trafficMap.js";
import ViewManager from "./viewManager.js";
export default class World {
  /**
   * @constructor
   * @param htmlAnchorId ID des HTML Elements, in welchem die World verankert sein soll.
   */
  constructor(htmlAnchorId, socket) {
    this.socket = socket;
    this.canvas = new fabric.Canvas(htmlAnchorId, {
      backgroundColor: "#8C8C8C",
      fireMiddleClick: true,
      renderOnAddRemove: false,
    });
    this.setupCanvas();

    /**@type {Map<String, Object>} Eine Map mit allen Objekten, welche auf dem Canvas platziert wurden*/
    this.objectList = new Map();
    this.name;
    this.currentProposal;
    this.heatMap = new Heatmap(this.canvas, this.objectList);
    this.heatMap.createHeatmap();
    /**@type {TrafficMap} */
    this.map = new TrafficMap(this.canvas);
    this.carManager = new CarManager(this.map);
    this.viewManager = new ViewManager(this);
    this.lastTime = new Date().getTime();
    this.currentTime = 0;
    this.deltaTime = 0;
    this.interval = 1000 / 30;
    this.render();
  }

  render() {
    this.currentTime = new Date().getTime();
    this.deltaTime = this.currentTime - this.lastTime;
    if (this.deltaTime > this.interval) {
      this.carManager.moveCars(this.deltaTime);
      this.canvas.renderAll();
      this.lastTime = this.currentTime - (this.deltaTime % this.interval);
    }
    window.requestAnimationFrame(() => {
      this.render();
    });
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
      "mouse:down": (options) => {
        this.handleMouseClick(options);
      },
    });
    document.addEventListener("keydown", (event) => {
      let keyCode = event.code;
      if (keyCode === "Space") {
        this.carManager.togglePause();
      }
      if (keyCode === "KeyP") {
        this.saveCanvas().then((results) => {
          console.log(results);
        });
      }
    });

    this.errorText = new fabric.Text("", {
      fill: "red",
      top: 0,
      left: this.canvas.width,
      originX: "right",
      hasControls: false,
      selectable: false,
    });
    this.canvas.add(this.errorText);
    this.socket.emit(EVENTS.CLIENT.REQUEST_PROPOSAL_OBJECTS);
    this.socket.on(EVENTS.SERVER.RECIEVE_PROPOSAL_OBJECTS, async (payload) => {
      let proposalJSON = payload.data;
      this.currentProposal = JSON.parse(proposalJSON);
      this.currentProposal.objects = new Map(
        window.Object.entries(this.currentProposal.objects)
      );
      await this.loadObjectsToCanvas(this.currentProposal.objects);
      this.onProposalObjectLoadFinished();
    });
  }

  clearCanvas() {
    this.objectList.forEach((object) => {
      this.canvas.remove(object.displayObject);
    });
    this.objectList = new Map();
  }

  onProposalObjectLoadFinished() {
    console.log(this.objectList.entries());
    this.viewManager.updateSavedView();
    console.log(this.viewManager);
  }

  /**
   * Lädt Objekte auf den Canvas
   */
  async loadObjectsToCanvas(objects) {
    console.log("LOADING OBJECTS", [...objects.values()]);
    await Promise.all(
      [...objects.values()].map(async (object) => {
        await this.loadObjectToCanvas(object);
      })
    );
  }

  loadObjectToCanvas(object, changeType = false) {
    return new Promise((resolve) => {
      fabric.Image.fromObject(object.displayObject, (oImg) => {
        object.displayObject = oImg;
        object.displayObject.id = object.id;
        let newObject = new Object("a");
        window.Object.assign(newObject, object);

        if (changeType) newObject.showChangeType(changeType);
        this.objectList.set(object.id, newObject);
        oImg.setControlsVisibility({
          mt: object.isScaleable,
          mb: object.isScaleable,
          ml: object.isScaleable,
          mr: object.isScaleable,
          bl: object.isScaleable,
          br: object.isScaleable,
          tl: object.isScaleable,
          tr: object.isScaleable,
          mtr: object.isRotateable,
        });
        oImg.lockMovementX = !object.isMoveable;
        oImg.lockMovementY = !object.isMoveable;
        this.canvas.add(oImg);
        resolve();
      });
    });
  }

  saveCanvas() {
    return new Promise((resolve) => {
      let listForJson = new Map();
      this.objectList.forEach(async (object, key) => {
        let objectJson = await object.getWithDisplayObjectAsJSON();
        listForJson.set(key, objectJson);
        if (listForJson.size === this.objectList.size) {
          resolve(JSON.stringify(window.Object.fromEntries(listForJson)));
        }
      });
      // console.log("AUS DEM LOOP:", objectJson);
      // let cloneIt = await JSON.parse(objectJson);
      // console.log(cloneIt.displayObject);
      // // fabric.Image.fromObject(cloneIt.displayObject, (oImg) => {
      //   this.canvas.add(oImg);
      // });
    });
  }

  handleMouseClick(options) {
    if (options.button === 2) this.map.logTile(options.pointer);
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

  toggleHeatmap() {
    if (this.heatMap.isVisible) {
      this.heatMap.hide();
      return;
    }
    this.heatMap.show();
  }
}
