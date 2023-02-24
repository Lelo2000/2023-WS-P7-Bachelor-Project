import { CHANGES, EVENTS } from "../constants.js";
import { Object } from "../simulation/object.js";
import Change from "./change.js";

export default class ViewManager {
  constructor() {
    this.currentProposal;
    this.savedView = new Map();
    this.isSaving = false;
    this.currentChanges = [];
    this.proposalObjectList = new Map();
    this.activeMessagesObjectList = new Map();
    this.playingMessage;
    this.currentObjectsList = new Map();
  }

  registerEvents() {
    window.addEventListener(
      EVENTS.SIMULATION.SEND_CANVAS_OBJECTS,
      (eventData) => {
        eventData.detail.opt.callback(eventData.detail.list);
      }
    );
  }

  addNewObjectToView(objectData) {
    let newObject = new Object("a");
    newObject.fromServerData(objectData);
    this.currentObjectsList.set(newObject.id, newObject);
    console.log("CURRENT OBJECT LIST: ", this.currentObjectsList);
    window.dispatchEvent(
      new CustomEvent(EVENTS.SIMULATION.ADD_OBJECT, { detail: newObject })
    );
  }

  requestCompareView() {
    this.requestCanvasObjects((list) => {
      this.compareView(list);
    });
  }

  compareView(list) {
    this.currentChanges = [];
    list.forEach((object, key) => {
      if (!this.savedView.has(key)) {
        let newChange = new Change(CHANGES.TYPES.ADDED, {
          id: key,
          addedObject: object,
        });
        this.currentChanges.push(newChange);
      }
    });
  }

  requestCanvasObjects(callback) {
    window.dispatchEvent(
      new CustomEvent(EVENTS.SIMULATION.REQUEST_CANVAS_OBJECTS, {
        detail: { opt: { callback: callback } },
      })
    );
  }

  saveView(list) {
    this.savedView = new Map();
    list.forEach((element) => {
      this.savedView.set(element.id, element);
    });
  }

  switchProposal(proposal) {
    this.currentProposal = proposal;
    this.loadProposalObjectsToCanvas();
  }

  loadProposalObjectsToCanvas() {
    let objects = this.currentProposal.objects;
    for (let id in objects) {
      let newObject = new Object("error");
      newObject.fromServerData(objects[id]);
      this.proposalObjectList.set(newObject.id, newObject);
      window.dispatchEvent(
        new CustomEvent(EVENTS.SIMULATION.LOAD_OBJECT, {
          detail: { object: newObject },
        })
      );
    }
    console.log("PROPOSAL LIST: ", this.proposalObjectList);
  }

  clearCanvas() {
    window.dispatchEvent(new CustomEvent(EVENTS.SIMULATION.CLEAR_CANVAS));
  }

  loadChangesToCanvas(changes) {
    this.clearCanvas();
    this.loadProposalObjectsToCanvas();
    changes.forEach((change) => {
      window.dispatchEvent(
        new CustomEvent(EVENTS.SIMULATION.LOAD_OBJECT, {
          detail: { object: change.options.addedObject },
        })
      );
    });
  }

  playMessage(message) {
    this.playingMessage = message;
    message.changes.forEach((change) => {
      switch (change.type) {
        case CHANGES.TYPES.ADDED:
          let newObject = new Object("error");
          newObject.fromServerData(change.options.addedObject);
          this.activeMessagesObjectList.set(newObject.id, newObject);
      }
    });
    console.log(this.activeMessagesObjectList);
    this.loadChangesToCanvas(message.changes);
  }
}
