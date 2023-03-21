import { EVENTS, TRAFFIC_SIM } from "../../constants.js";
import CarManager from "./carManager.js";

export default class SimulationManager {
  constructor(world) {
    this.world = world;
    this.carManager = new CarManager(this.world.map);
    this.pause = true;
  }

  init() {
    this.registerEvents();
  }

  togglePause() {
    this.pause = Math.abs(this.pause - 1);
    this.carManager.pause = this.pause;
  }

  registerEvents() {
    window.addEventListener(EVENTS.SIMULATION.TOGGLE_PAUSE, (event) => {
      this.togglePause();
    });
    window.addEventListener(EVENTS.SIMULATION.SET_TRAFFIC, (event) => {
      let details = event.detail;
      switch (details.vehicle) {
        case TRAFFIC_SIM.VEHICLES.CAR:
          this.carManager.changeOptions(details.options);
          break;
      }
    });
    document.addEventListener("keydown", (event) => {
      let keyCode = event.code;
    });
  }

  onRender(deltaTime) {
    this.carManager.moveCars(deltaTime);
  }
}
