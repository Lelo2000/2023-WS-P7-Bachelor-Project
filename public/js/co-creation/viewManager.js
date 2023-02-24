import { CHANGES, EVENTS } from "../constants.js";
import Change from "./change.js";

export default class ViewManager {
  constructor() {
    this.currentProposal;
    this.savedView = new Map();
    this.saveQue = new Map();
    this.isSaving = false;
    this.currentChanges = [];
  }

  registerEvents() {
    window.addEventListener(EVENTS.SIMULATION.LOADED_OBJECT, (eventData) => {
      this.saveQue.delete(eventData.detail.objectId);
      if (this.saveQue.size === 0) {
        console.log("SAVE");
        this.requestCanvasObjects((list) => {
          this.saveView(list);
        });
      }
    });
    window.addEventListener(
      EVENTS.SIMULATION.SEND_CANVAS_OBJECTS,
      (eventData) => {
        eventData.detail.opt.callback(eventData.detail.list);
      }
    );
  }

  requestCompareView() {
    this.requestCanvasObjects((list) => {
      this.compareView(list);
    });
  }

  compareView(list) {
    this.currentChanges = [];
    console.log("SAVED LIST: ", this.savedView);
    console.log("LISTE:", list);
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
    this.queForSaving(objects);
    for (let id in this.currentProposal.objects) {
      window.dispatchEvent(
        new CustomEvent(EVENTS.SIMULATION.LOAD_OBJECT, {
          detail: { object: objects[id] },
        })
      );
    }
  }

  clearCanvas() {
    window.dispatchEvent(new CustomEvent(EVENTS.SIMULATION.CLEAR_CANVAS));
  }

  loadChangesToCanvas(changes) {
    console.log(changes);
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

  queForSaving(objects) {
    for (let id in objects) {
      this.saveQue.set(Number(id), objects[id]);
    }
  }
}
