const TEMPORARY = {
  AUTHOR: {
    NAME: "Test User",
  },
};

const HTML_IDS = {
  SIDE_MENU: {
    ID: "sideMenu",
    ACTIVE: "active",
    ALL: "all",
    FINISHED: "finished",
    IDEAS: "ideas",
    VIEW: "view",
    HOME: "home",
    REDO: "redo",
    UNDO: "undo",
    ATTRIBUTES: "attributes",
    COMMENTS: "comments",
    DISCUSSION: "discussion",
    EXPERT: "askExpert",
    PROPOSAL_SWITCH: "proposalSwitch",
    FAQ: "faq",
  },
  FOLD_OUT: {
    ID: "sideMenuFoldOut",
    IDEA_CONTAINER: "ideaContainer",
    BUTTON: "sideMenuFoldOutButton",
  },
  IDEA_OPEN: {
    ID: "ideaOpen",
    IDEA_SPACE: "ideaSpace",
  },
  INFORMATION_BUBBLE: {
    ID: "informtaionBubble",
    CONTENT: "informationBubbleContent",
  },
  BOTTOM_MENU: {
    ID: "simulationBox",
    BOX_SIZER: "simulationBoxSizer",
    OPTIONS: {
      OBJECTS: "optionObjects",
      SIMULATION: "optionSimulation",
      VIEWS: "optionViews",
      FILTER_OBJECT_TAGS: "filterObjectTags",
      OBJECT_SEARCH: "optionObjectSearch",
      OBJECT_SEARCH_SPACE: "objectSearchSpace",
      INPUT_CAR_TRAFFIC: "inputCarTraffic",
      VALUE_CAR_TRAFFIC: "valueCarTraffic",
    },
    CONTAINER: {
      OBJECTS: "objectsContainer",
    },
  },
  OPEN_INFORMATION: {
    ID: "openInformation",
    CONTENT: "openInformationContent",
    BOX: "openInformationBox",
    CLOSE: "closeOpenInformation",
  },
};

const PROJECT = {
  PHASE: {
    COLLECT_ATTRIBUTES: "collectAttributes",
    CO_CREATION: "coCreation",
  },
};

const IDEA = {
  STATUS: {
    FINISHED: "finished",
    ACTIVE: "active",
    IDEA: "idea",
  },
};

const TRAFFIC_SIM = {
  GRID: { RESOLUTION: 60 },
  TILES: {
    EMPTY: "empty",
    ROAD: "road",
    CROSSING: "crossing",
    BESIDE_STREET: "beside_street",
  },
  IMAGES: {
    STREET: "/images/simulation/tiles/street.svg",
    CAR: "/images/simulation/vehicles/car.svg",
  },
  VEHICLES: {
    CAR: "car",
  },
  STREET_RULES: {
    SPEED: "speed",
  },
  CATEGORIES: {
    STREET_SIGNS: "Straßenschild",
    SPEED_SIGN: "Geschwindigkeitsbegrenzung",
  },
};

const EVENTS = {
  SERVER: {
    SEND_PROPOSALS: "recievePRoposalObjects",
    SEND_IDEAS: "send ideas",
    NEW_MESSAGE: "newMessage",
    NEW_IDEA: "newidea",
    SEND_ATTRIBUTES: "sendAttributes",
    SEND_OBJECTS_DATA: "sendObjectsData",
    SEND_MESSAGES: "sendMessages",
  },
  CLIENT: {
    REQUEST_PROPOSALS: "getProposalObjects",
    REQUEST_IDEAS: "reqeust Ideas",
    SEND_MESSAGE: "sendMessage",
    SEND_IDEA: "sendIdea",
    SEND_ATTRIBUTES: "sendAttributes",
    REQUEST_ATTRIBUTES: "requestAttributes",
    REQUEST_OBJECTS_DATA: "requestObjectsData",
    REQUEST_MESSAGES: "requestMessages",
  },
  SIMULATION: {
    ADD_OBJECT: "addObject",
    TOGGLE_PAUSE: "togglePause",
    SET_TRAFFIC: "setTraffic",
    LOAD_OBJECT: "loadObject",
    LOADED_OBJECT: "loadedObject",
    REQUEST_CANVAS_OBJECTS: "reuqestCanvasObejcts",
    SEND_CANVAS_OBJECTS: "sendCAnvasObjects",
    CLEAR_CANVAS: "clearCanvas",
    DELETE_OBJECT: "deleteObject",
    ON_OBJECT_DELETION: "onObjectDeletion",
  },
};

const CHANGES = {
  TYPES: {
    ADDED: "added",
    DELETED: "deleted",
    CHANGED: "changed",
    MOVED: "moved",
  },
};
const MESSSAGES = {
  ACTIVE_TYPES: {
    ACTIVE: "active",
    DEPENDENCY: "dependency",
  },
};

export {
  TRAFFIC_SIM,
  EVENTS,
  CHANGES,
  MESSSAGES,
  TEMPORARY,
  IDEA,
  HTML_IDS,
  PROJECT,
};
