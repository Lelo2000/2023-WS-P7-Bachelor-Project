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

export { TRAFFIC_SIM, EVENTS };
