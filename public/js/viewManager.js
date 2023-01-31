import Change from "./change.js";
import { CHANGES } from "./constants.js";
import Message from "./message.js";
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

  /**
   * @param {Message} message
   */
  async loadMessage(message) {
    /**
     * @type {Array<Change>}
     */
    let changes = message.changes;
    for (let change of changes) {
      switch (change.type) {
        case CHANGES.TYPES.ADDED:
          if (!this.world.objectList.has(change.options.addedObject.id))
            await this.world.loadObjectToCanvas(
              change.options.addedObject,
              change.type
            );
          break;
      }
    }
  }

  async resetCanvasToBasics() {
    this.world.clearCanvas();
    await this.world.loadObjectsToCanvas(this.world.currentProposal.objects);
  }

  /**@param {Array<Message>} messages */
  async loadMessages(messages) {
    await this.resetCanvasToBasics();
    for (let message of messages) {
      await this.loadMessage(message);
    }
    this.updateSavedView();
  }
}
