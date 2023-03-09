import { EVENTS, TRAFFIC_SIM } from "../constants.js";
import Heatmap from "./heatmap.js";
import { Object } from "./object.js";
import CarManager from "./trafficSim/carManager.js";
import SimulationManager from "./trafficSim/simulationManager.js";
import TrafficMap from "./trafficSim/trafficMap.js";
import ViewManager from "../co-creation/viewManager.js";
export default class World {
  /**
   * @constructor
   * @param htmlAnchorId ID des HTML Elements, in welchem die World verankert sein soll.
   */
  constructor(htmlAnchorId, socket) {
    this.socket = socket;
    this.canvas = new fabric.Canvas(htmlAnchorId, {
      fireMiddleClick: true,
      renderOnAddRemove: false,
    });
    this.setupCanvas();

    /**@type {Map<String, Object>} Eine Map mit allen Objekten, welche auf dem Canvas platziert wurden*/
    this.objectList = new Map();
    this.name;
    this.currentProposal;
    this.heatMap = new Heatmap(this.canvas, this.objectList);
    /**@type {TrafficMap} */
    this.map = new TrafficMap(this.canvas);
    this.simulationManager = new SimulationManager(this);
    // this.viewManager = new ViewManager(this);
    this.lastTime = new Date().getTime();
    this.currentTime = 0;
    this.deltaTime = 0;
    this.interval = 1000 / 30;
    this.bounderies = 2520;
    this.bounderiesY = 1860;
    this.initializeWorld();
    this.isDragging = false;
    this.isDraggingKeyDown = false;
  }

  initializeWorld() {
    this.initializeStandardElements();
    this.registerDomEventListener();
    this.heatMap.createHeatmap();
    this.simulationManager.init();
    this.map.registerEvents();
    this.render();
  }

  render() {
    this.currentTime = new Date().getTime();
    this.deltaTime = this.currentTime - this.lastTime;
    if (this.deltaTime > this.interval) {
      this.simulationManager.onRender();
      this.canvas.setViewportTransform(this.canvas.viewportTransform);
      this.canvas.renderAll();

      this.lastTime = this.currentTime - (this.deltaTime % this.interval);
    }
    window.requestAnimationFrame(() => {
      this.render();
    });
  }

  addObjectFromObjectData(newObject, position) {
    fabric.Image.fromURL(newObject.imageUrl, (oImg) => {
      let positionTransformed = fabric.util.transformPoint(
        position,
        this.canvas.viewportTransform
      );
      let vx = position.x - positionTransformed.x;
      let vy = position.y - positionTransformed.y;

      oImg.top = position.y + vy * (1 / this.canvas.getZoom());
      oImg.left = position.x + vx * (1 / this.canvas.getZoom());
      oImg.originX = "center";
      oImg.originY = "center";

      if (
        newObject.categories.indexOf(TRAFFIC_SIM.CATEGORIES.STREET_SIGNS) >= 0
      ) {
        oImg.scaleToWidth(this.map.resolution);
        oImg.scaleToHeight(this.map.resolution);
      }

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
      this.canvas.add(oImg);
      this.canvas.setActiveObject(oImg);
      oImg.id = newObject.id;
      newObject.displayObject = oImg;
      this.addToObjectList(newObject);
    });
  }

  addToObjectList(obj) {
    let ownObject = new Object(obj.displayObject);
    ownObject.fromServerData(obj);
    this.objectList.set(ownObject.id, ownObject);
  }

  /**
   * @param {Object}
   */
  applySpecialObjectAttributes(object, objectData) {
    object.categories.forEach((categorie) => {
      switch (categorie) {
        case TRAFFIC_SIM.CATEGORIES.STREET_SIGNS:
          object.rules = objectData.rules;
      }
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
      this.objectList.set(newObject.id, newObject);
    });
  }

  setupCanvas() {
    this.canvas.setWidth(window.innerWidth);
    this.canvas.setHeight(window.innerHeight);

    //Canvas Events
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
    /**
    Code nach dem Tutorial der Fabric JS Dokumentation zu zooming und panning
    http://fabricjs.com/fabric-intro-part-5
    */
    this.canvas.on("mouse:wheel", (opt) => {
      var delta = opt.e.deltaY;
      var zoom = this.canvas.getZoom();
      zoom *= 0.999 ** delta;
      if (zoom > 20) zoom = 20;
      if (zoom < 0.01) zoom = 0.01;
      if (zoom > this.canvas.getWidth() / this.bounderies) {
        this.canvas.zoomToPoint({ x: opt.e.offsetX, y: opt.e.offsetY }, zoom);
      } else {
        zoom = this.canvas.getWidth() / this.bounderies;
      }
      opt.e.preventDefault();
      opt.e.stopPropagation();
      var vpt = this.canvas.viewportTransform;
      if (zoom < this.canvas.getWidth() / this.bounderies) {
        vpt[4] = this.canvas.getWidth() / 2 - (this.bounderies * zoom) / 2;
        vpt[5] = this.canvas.getWidth() / 2 - (this.bounderies * zoom) / 2;
      } else {
        if (vpt[4] >= 0) {
          vpt[4] = 0;
        } else if (vpt[4] < this.canvas.getWidth() - this.bounderies * zoom) {
          vpt[4] = this.canvas.getWidth() - this.bounderies * zoom;
        }
        if (vpt[5] >= 0) {
          vpt[5] = 0;
        } else if (vpt[5] < this.canvas.getHeight() - this.bounderiesY * zoom) {
          vpt[5] = this.canvas.getHeight() - this.bounderiesY * zoom;
        }
      }
    });
    this.canvas.on("mouse:down", (opt) => {
      let evt = opt.e;
      if (this.isDraggingKeyDown === true) {
        this.isDragging = true;
        this.canvas.selection = false;
        this.canvas.discardActiveObject();
        this.canvas.renderAll();
        this.lastPosX = evt.clientX;
        this.lastPosY = evt.clientY;
        console.log("EVENT");
      }
    });
    this.canvas.on("mouse:move", (opt) => {
      if (this.isDragging) {
        var e = opt.e;
        var zoom = this.canvas.getZoom();
        var vpt = this.canvas.viewportTransform;
        if (zoom < this.canvas.getWidth() / this.bounderies) {
          vpt[4] = this.canvas.getWidth() / 2 - (this.bounderies * zoom) / 2;
          vpt[5] = this.canvas.getWidth() / 2 - (this.bounderies * zoom) / 2;
        } else {
          vpt[4] += e.clientX - this.lastPosX;
          vpt[5] += e.clientY - this.lastPosY;
          if (vpt[4] >= 0) {
            vpt[4] = 0;
          } else if (vpt[4] < this.canvas.getWidth() - this.bounderies * zoom) {
            vpt[4] = this.canvas.getWidth() - this.bounderies * zoom;
          }
          if (vpt[5] >= 0) {
            vpt[5] = 0;
          } else if (
            vpt[5] <
            this.canvas.getHeight() - this.bounderiesY * zoom
          ) {
            vpt[5] = this.canvas.getHeight() - this.bounderiesY * zoom;
          }
        }
        this.canvas.requestRenderAll();
        this.lastPosX = e.clientX;
        this.lastPosY = e.clientY;
      }
    });
    this.canvas.on("mouse:up", (opt) => {
      this.canvas.setViewportTransform(this.canvas.viewportTransform);
      this.isDragging = false;
      this.canvas.selection = true;
    });

    window.rotationIcon = new Image();
    window.rotationIcon.onload = () => {
      console.log(window.rotationIcon);
      fabric.Object.prototype.controls.mtr = new fabric.Control({
        x: 0.5,
        y: -0.5,
        offsetX: 20,
        offsetY: -20,
        cursorStyle: "crosshair",
        actionHandler: fabric.controlsUtils.rotationWithSnapping,
        actionName: "rotate",
        render: renderRotateIcon,
        cornerSize: 20,
        withConnection: false,
      });
    };
    window.rotationIcon.src = "/images/icons/arrow_circle.svg";

    window.deleteIcon = new Image();
    fabric.Object.prototype.controls.deleteControl = new fabric.Control({
      x: 0.5,
      y: -0.5,
      offsetX: -10,
      offsetY: -20,
      cursorStyle: "pointer",
      mouseUpHandler: (eventData, transform) => {
        this.deleteObject(transform.target.id);
      },
      render: renderDeleteIcon,
      cornerSize: 20,
    });
    window.deleteIcon.src = "/images/icons/trash_bin.svg";
  }

  initializeStandardElements() {
    fabric.Image.fromURL("/images/simulation/tiles/background.svg", (oImg) => {
      oImg.set({
        top: 0,
        left: 0,
        hasControls: false,
        selectable: false,
        opacity: 1,
      });
      this.canvas.add(oImg);
    });

    //Standard Elemente
    this.errorText = new fabric.Text("", {
      fill: "red",
      top: 0,
      left: this.canvas.width,
      originX: "right",
      hasControls: false,
      selectable: false,
    });
    this.canvas.add(this.errorText);
  }

  registerDomEventListener() {
    //Dokument Eventlistener
    document.addEventListener("keydown", (event) => {
      let keyCode = event.code;
      if (keyCode === "Space") {
        if (this.isDraggingKeyDown === false) {
          this.isDraggingKeyDown = true;
          this.objectList.forEach((object) => {
            object.displayObject.lockMovementX = true;
            object.displayObject.lockMovementY = true;
          });
        }

        // this.saveCanvas().then((results) => {
        //   console.log(results);
        // });
      }
    });
    document.addEventListener("keyup", (event) => {
      let keyCode = event.code;
      if (keyCode === "Space") {
        if (this.isDraggingKeyDown === true) {
          this.isDraggingKeyDown = false;
          this.objectList.forEach((object) => {
            console.log(object);
            object.displayObject.lockMovementX = !object.isMoveable;
            object.displayObject.lockMovementY = !object.isMoveable;
          });
        }

        // this.saveCanvas().then((results) => {
        //   console.log(results);
        // });
      }
    });
  }

  clearCanvas() {
    this.objectList.forEach((object) => {
      this.canvas.remove(object.displayObject);
    });
    this.objectList = new Map();
  }

  onProposalObjectLoadFinished() {
    // this.viewManager.updateSavedView();
  }

  /**
   * Lädt Objekte auf den Canvas
   */
  async loadObjectsToCanvas(objects) {
    await Promise.all(
      [...objects.values()].map(async (object) => {
        await this.loadObjectToCanvas(object);
      })
    );
  }

  loadObjectToCanvas(newObject) {
    fabric.Image.fromObject(newObject.displayObject, (oImg) => {
      newObject.displayObject = oImg;
      newObject.displayObject.id = newObject.id;

      oImg.setControlsVisibility({
        mt: newObject.isScaleable,
        mb: newObject.isScaleable,
        ml: newObject.isScaleable,
        mr: newObject.isScaleable,
        bl: newObject.isScaleable,
        br: newObject.isScaleable,
        tl: newObject.isScaleable,
        tr: newObject.isScaleable,
        mtr: newObject.isRotateable,
        deleteControl: newObject.isDeleteable,
      });
      oImg.lockMovementX = !newObject.isMoveable;
      oImg.lockMovementY = !newObject.isMoveable;
      this.canvas.add(oImg);
      this.addToObjectList(newObject);
    });
  }

  // loadObjectToCanvas(object, changeType = false) {
  //   return new Promise((resolve) => {
  //     let newObject = new Object("a");
  //     window.Object.assign(newObject, object);
  //     fabric.Image.fromObject(newObject.displayObject, (oImg) => {
  //       newObject.displayObject = oImg;
  //       newObject.displayObject.id = newObject.id;

  //       this.objectList.set(newObject.id, newObject);
  //       oImg.setControlsVisibility({
  //         mt: newObject.isScaleable,
  //         mb: newObject.isScaleable,
  //         ml: newObject.isScaleable,
  //         mr: newObject.isScaleable,
  //         bl: newObject.isScaleable,
  //         br: newObject.isScaleable,
  //         tl: newObject.isScaleable,
  //         tr: newObject.isScaleable,
  //         mtr: newObject.isRotateable,
  //         deleteControl: newObject.isDeleteable,
  //       });
  //       oImg.lockMovementX = !newObject.isMoveable;
  //       oImg.lockMovementY = !newObject.isMoveable;
  //       if (changeType) {
  //         newObject.showChangeType(changeType);
  //       }
  //       this.canvas.add(oImg);
  //       window.dispatchEvent(
  //         new CustomEvent(EVENTS.SIMULATION.LOADED_OBJECT, {
  //           detail: { objectId: newObject.id },
  //         })
  //       );
  //       resolve();
  //     });
  //   });
  // }

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
    this.moveStreetSign(options);
    this.checkForCollisions(options);
    this.checkForErrors();
    if (this.heatMap.isVisible) {
      this.heatMap.colorHeatmap();
    }
  }

  moveStreetSign(options) {
    let movedObjectId = options.target.id;
    let movedObject = this.objectList.get(movedObjectId);
    if (
      movedObject.categories.indexOf(TRAFFIC_SIM.CATEGORIES.STREET_SIGNS) < 0
    ) {
      return;
    }
    let mouseICoordinates = this.map.getIndexCoordinates(
      options.pointer.x,
      options.pointer.y
    );
    let mapTile = this.map.getTile(mouseICoordinates.x, mouseICoordinates.y);
    if (mapTile.type != TRAFFIC_SIM.TILES.BESIDE_STREET) {
      return;
    }
    if (movedObject.lastTile != undefined) {
      movedObject.lastTile.removeContent(movedObject);
    }
    if (!mapTile.place(movedObject)) {
      return;
    } else {
      movedObject.lastTile = mapTile;
    }
    let objectICoordinates = this.map.getRealCoordinates(
      mouseICoordinates.x,
      mouseICoordinates.y
    );
    let movedDisplayObject = movedObject.displayObject;
    let movedDisplayObjectWidth =
      movedDisplayObject.width * movedDisplayObject.scaleX;
    let movedDisplayObjectHeight =
      movedDisplayObject.height * movedDisplayObject.scaleX;

    movedDisplayObject.left =
      objectICoordinates.x + movedDisplayObjectWidth / 2;
    movedDisplayObject.top =
      objectICoordinates.y + movedDisplayObjectHeight / 2;
  }

  checkForCollisions(options) {
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

  deleteObject(id) {
    console.log("OBJECT WIRD GELÖSCHT: ", this.objectList.get(id));
    window.dispatchEvent(
      new CustomEvent(EVENTS.SIMULATION.ON_OBJECT_DELETION, {
        detail: { id: id },
      })
    );
    this.canvas.remove(this.objectList.get(id).displayObject);
    this.objectList.delete(id);
  }

  getCanvasObjects() {
    return this.objectList;
  }
}

// Defining how the rendering action will be
function renderRotateIcon(ctx, left, top, styleOverride, fabricObject) {
  var size = this.cornerSize;
  ctx.save();
  ctx.translate(left, top);
  ctx.rotate(fabric.util.degreesToRadians(fabricObject.angle));
  ctx.drawImage(window.rotationIcon, -size / 2, -size / 2, size, size);
  ctx.restore();
}

function renderDeleteIcon(ctx, left, top, styleOverride, fabricObject) {
  var size = this.cornerSize;
  ctx.save();
  ctx.translate(left, top);
  ctx.rotate(fabric.util.degreesToRadians(fabricObject.angle));
  ctx.drawImage(window.deleteIcon, -size / 2, -size / 2, size, size);
  ctx.restore();
}
