import { CHANGES } from "./constants.js";

export class Object {
  constructor(displayObject) {
    this.id = Math.random();
    this.tags = ["object"];
    this.displayObject = displayObject;
    this.isCollided = false;
    /**@type {Array} Array an Objekt Ids von den Objekten mit denen es kollidiert ist. */
    this.collidedObjectIds = [];
    this.isMoveable = true;
    this.isDeleteable = true;
    this.isRotateable = true;
    this.isScaleable = false;
    this.messagesWithObject = [];
    this.isVisible = true;
    this.name = "";
    this.explanation = "";
  }

  showChangeType(type) {
    switch (type) {
      case CHANGES.TYPES.ADDED:
        this.displayObject.set({ stroke: "#a1ff85", strokeWidth: 4 });
        break;
    }
  }

  show() {
    this.isVisible = true;
    this.displayObject.set("opacity", 1);
  }

  hide() {
    this.isVisible = false;
    this.displayObject.set("opacity", 0);
  }

  getWithDisplayObjectAsJSON() {
    return new Promise((resolve) => {
      this.displayObject.setCoords();
      this.displayObject.clone((displayTemp) => {
        this.displayObject = "PLATZHALTER";
        let jsonObject = structuredClone(this);
        this.displayObject = displayTemp;
        jsonObject.displayObject = displayTemp;
        jsonObject.displayObject = jsonObject.displayObject.toJSON();
        resolve(jsonObject);
      });
    });
  }

  /**
   * Wird aufgerufen, wenn es mit einem anderen Objekt kollidiert
   * @param collidedObjectId ID des Objektes mit dem es kollidiert ist.
   */
  onCollision(collidedObjectId) {
    if (this.collidedObjectIds.indexOf(collidedObjectId) >= 0) return;
    this.collidedObjectIds.push(collidedObjectId);
    this.updateCollisionStatus();
  }

  updateCollisionStatus() {
    if (this.collidedObjectIds.length > 0) {
      this.isCollided = true;
      this.displayObject.set("opacity", 0.5);
    } else {
      this.isCollided = false;
      this.displayObject.set("opacity", 1);
    }
  }

  /**
   * Wird aufgerufen, wenn es ein Objekt nicht mit dem Objekt kollidiert.
   * @param removedObjectId ID des Objektes mit dem es eventuell vorher kollidiert ist.
   */
  endCollision(removedObjectId) {
    if (this.collidedObjectIds.indexOf(removedObjectId) < 0) return;
    this.collidedObjectIds.splice(
      this.collidedObjectIds.indexOf(removedObjectId),
      1
    );
    this.updateCollisionStatus();
  }
}
