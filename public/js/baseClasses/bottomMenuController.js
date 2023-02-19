import { HTML_IDS } from "../constants.js";

export default class BottomMenuController {
  constructor(bottomMenu) {
    this.bottomMenu = bottomMenu;
    this.grabLine = bottomMenu.find(".grabLine");
    this.expandedOption = HTML_IDS.BOTTOM_MENU.OPTIONS.OBJECTS;
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
    this.expandOption(this.expandedOption);
  }

  init() {
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
      this.showElement(this.optionSimulation.find("#optionTraffic"), "30%");
      this.showElement(this.optionSimulation.find("#optionWeather"), "12.5%");
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
    this.hideElement(this.optionSimulation.find("#optionWeather"));
    this.hideElement(this.optionSimulation.find("#optionDisplay"));
    this.hideElement(this.optionSimulation.find(".lineVertical"));
  }

  hideElement(element) {
    element.css({ visibility: "hidden", width: "0%" });
  }
  showElement(element, width) {
    element.css({ visibility: "visible", width: width });
  }
}
