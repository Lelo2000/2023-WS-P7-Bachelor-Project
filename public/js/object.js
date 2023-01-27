export class Object {
  constructor(displayObject) {
    this.id = Math.random();
    this.tags = ["object"];
    this.displayObject = displayObject;
    this.isCollided = false;
    /**@type {Array} Array an Objekt Ids von den Objekten mit denen es kollidiert ist. */
    this.collidedObjectIds = [];
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
