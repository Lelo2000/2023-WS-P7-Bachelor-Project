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
  },
  FOLD_OUT: {
    ID: "sideMenuFoldOut",
    IDEA_CONTAINER: "ideaContainer",
    BUTTON: "sideMenuFoldOutButton",
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
  GRID: { RESOLUTION: 20 },
  TILES: {
    EMPTY: "empty",
    ROAD: "road",
    CROSSING: "crossing",
  },
  VEHICLES: {
    CAR: "car",
  },
};

const EVENTS = {
  SERVER: {
    RECIEVE_PROPOSAL_OBJECTS: "recievePRoposalObjects",
    SEND_IDEAS: "send ideas",
    NEW_MESSAGE: "newMessage",
    NEW_IDEA: "newidea",
  },
  CLIENT: {
    REQUEST_PROPOSAL_OBJECTS: "getProposalObjects",
    REQUEST_IDEAS: "reqeust Ideas",
    SEND_MESSAGE: "sendMessage",
    SEND_IDEA: "sendIdea",
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

export { TRAFFIC_SIM, EVENTS, CHANGES, MESSSAGES, TEMPORARY, IDEA, HTML_IDS };
