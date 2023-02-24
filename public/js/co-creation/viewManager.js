import { EVENTS } from "../constants.js";

export default class ViewManager {
  constructor() {
    this.currentProposal;
    this.savedView = new Map();
  }

  saveView() {}

  switchProposal(proposal) {
    this.currentProposal = proposal;
    this.loadProposalObjectsToCanvas();
  }

  loadProposalObjectsToCanvas() {
    let objects = this.currentProposal.objects;
    for (let object in this.currentProposal.objects) {
      window.dispatchEvent(
        new CustomEvent(EVENTS.SIMULATION.LOAD_OBJECT, {
          detail: { object: objects[object] },
        })
      );
    }
  }
}
