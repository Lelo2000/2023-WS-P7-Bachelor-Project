import Change from "./change.js";
import { CHANGES } from "./constants.js";
import World from "./world.js";

export default class ViewManager {
  /**
   * @param {World} world
   */
  constructor(world) {
    this.world = world;
    this.canvas = world.canvas;
    this.savedView = new Map();
  }

  updateSavedView() {
    this.savedView = new Map(this.world.objectList);
  }

  /**
   * @param {Map} objectList
   */
  compareViews(objectList) {
    let takenChanges = [];
    objectList.forEach((object, key) => {
      if (!this.savedView.has(key)) {
        let newChange = new Change(CHANGES.TYPES.ADDED, {
          id: key,
          addedObject: object,
        });
        takenChanges.push(newChange);
      }
    });
    return takenChanges;
  }
}
