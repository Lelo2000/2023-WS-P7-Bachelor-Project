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
    NEW_MESSAGE: "newMessage",
  },
  CLIENT: {
    REQUEST_PROPOSAL_OBJECTS: "getProposalObjects",
    SEND_MESSAGE: "sendMessage",
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

export { TRAFFIC_SIM, EVENTS, CHANGES, MESSSAGES };
