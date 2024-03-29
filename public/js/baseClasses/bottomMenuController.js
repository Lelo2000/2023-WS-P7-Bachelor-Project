import ViewManager from "../co-creation/viewManager.js";
import { HTML_IDS, EVENTS, TRAFFIC_SIM } from "../constants.js";

export default class BottomMenuController {
  /**
   * @param {ViewManager} viewManager
   */
  constructor(bottomMenu, viewManager) {
    this.bottomMenu = bottomMenu;
    this.viewManager = viewManager;
    this.grabLine = bottomMenu.find(".grabLine");
    this.expandedOption = HTML_IDS.BOTTOM_MENU.OPTIONS.OBJECTS;
    this.toggleOpen = true;
    this.optionSimulation = bottomMenu.find(
      "#" + HTML_IDS.BOTTOM_MENU.OPTIONS.SIMULATION
    );
    this.optionObjects = bottomMenu.find(
      "#" + HTML_IDS.BOTTOM_MENU.OPTIONS.OBJECTS
    );
    this.optionViews = bottomMenu.find(
      "#" + HTML_IDS.BOTTOM_MENU.OPTIONS.VIEWS
    );
    this.filterObjectTags = bottomMenu.find(
      "#" + HTML_IDS.BOTTOM_MENU.OPTIONS.FILTER_OBJECT_TAGS
    );
    this.objectSearch = bottomMenu.find(
      "#" + HTML_IDS.BOTTOM_MENU.OPTIONS.OBJECT_SEARCH
    );
    this.objectSearchSpace = bottomMenu.find(
      "#" + HTML_IDS.BOTTOM_MENU.OPTIONS.OBJECT_SEARCH_SPACE
    );
    this.objectsContainer = bottomMenu.find(
      "#" + HTML_IDS.BOTTOM_MENU.CONTAINER.OBJECTS
    );
    this.boxSizer = bottomMenu.find("#" + HTML_IDS.BOTTOM_MENU.BOX_SIZER);
    this.expandOption(this.expandedOption);
  }

  sizeBoxSmall() {
    this.bottomMenu.css("bottom", "-222px");
    this.toggleOpen = false;
  }

  sizeBoxBig() {
    this.bottomMenu.css("bottom", "25px");
    this.toggleOpen = true;
  }

  init() {
    let playButton = this.optionSimulation
      .find(".simulationControlls")
      .find(".play");
    playButton.on("click", () => {
      window.dispatchEvent(new CustomEvent(EVENTS.SIMULATION.TOGGLE_PAUSE));
      if (playButton.hasClass("icon-play")) {
        playButton.removeClass("icon-play");
        playButton.addClass("icon-pause");
      } else {
        playButton.removeClass("icon-pause");
        playButton.addClass("icon-play");
      }
    });
    this.boxSizer.on("click", () => {
      console.log("SIZE BOX");
      if (this.toggleOpen) {
        this.sizeBoxSmall();
      } else {
        this.sizeBoxBig();
      }
    });

    let inpuCarTraffic = this.bottomMenu
      .find("#" + HTML_IDS.BOTTOM_MENU.OPTIONS.INPUT_CAR_TRAFFIC)
      .on("change", () => {
        let value = inpuCarTraffic.val();
        window.dispatchEvent(
          new CustomEvent(EVENTS.SIMULATION.SET_TRAFFIC, {
            detail: {
              vehicle: TRAFFIC_SIM.VEHICLES.CAR,
              options: { flow: value },
            },
          })
        );
        this.bottomMenu
          .find("#" + HTML_IDS.BOTTOM_MENU.OPTIONS.VALUE_CAR_TRAFFIC)
          .html(`${value} Autos/min`);
      });
    this.grabLine.on("click", (e) => {
      console.log("Clicked");
      if (this.expandedOption === HTML_IDS.BOTTOM_MENU.OPTIONS.OBJECTS) {
        this.expandOption(HTML_IDS.BOTTOM_MENU.OPTIONS.SIMULATION);
      } else {
        this.expandOption(HTML_IDS.BOTTOM_MENU.OPTIONS.OBJECTS);
      }
    });
  }

  expandOption(optionId) {
    switch (optionId) {
      case HTML_IDS.BOTTOM_MENU.OPTIONS.SIMULATION:
        this.optionObjects.css("width", "20%");
        this.expandSimulationOptions(true);
        this.filterObjectTags.css("display", "none");
        this.objectSearch.css("width", "100%");
        this.objectSearchSpace.css("width", "80%");
        break;
      case HTML_IDS.BOTTOM_MENU.OPTIONS.OBJECTS:
        this.optionObjects.css("width", "65%");
        this.expandSimulationOptions(false);
        this.filterObjectTags.css("display", "block");
        this.objectSearch.css("width", "48%");
        this.objectSearchSpace.css("width", "55%");
        break;
      case HTML_IDS.BOTTOM_MENU.OPTIONS.VIEWS:
        break;
    }
    this.expandedOption = optionId;
  }

  expandSimulationOptions(expand) {
    if (expand) {
      this.optionSimulation.css("width", "65%");
      this.showElement(this.optionSimulation.find("#optionGeneral"), "25%");
      this.showElement(this.optionSimulation.find("#optionTraffic"), "42.5%");
      this.showElement(
        this.optionSimulation.find("#optionDisplay"),
        "calc(150px - 16px)"
      );
      this.showElement(this.optionSimulation.find(".lineVertical"), "1px");
      return;
    }
    this.optionSimulation.css("width", "20%");
    this.showElement(this.optionSimulation.find("#optionGeneral"), "100%");
    this.hideElement(this.optionSimulation.find("#optionTraffic"));
    this.hideElement(this.optionSimulation.find("#optionDisplay"));
    this.hideElement(this.optionSimulation.find(".lineVertical"));
  }

  hideElement(element) {
    element.css({ visibility: "hidden", width: "0%" });
  }

  showElement(element, width) {
    element.css({ visibility: "visible", width: width });
  }

  loadObjectsForAdding(objectList) {
    objectList.forEach((obj) => {
      let newObject = $(`
    <div class="object">
    <img class="objectImage" src="${obj.imageUrl}" />
    <div class="flex-spacebetween">
      <span>${obj.name}</span><img class="icon-information" />
    </div>
  </div>`);

      newObject.on("click", () => {
        this.onObjectAdded(obj);
        this.viewManager.addNewObjectToView(obj);
        // window.dispatchEvent(
        //   new CustomEvent(EVENTS.SIMULATION.ADD_OBJECT, {
        //     detail: obj,
        //   })
        // );
      });
      this.objectsContainer.append(newObject);
    });
  }
  onObjectAdded(objectData) {}
}
