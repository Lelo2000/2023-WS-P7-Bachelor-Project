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
  STARTED: "started",
  REQUEST_PROPOSAL_OBJECTS: "getProposalObjects",
  RECIEVE_PROPOSAL_OBJECTS: "recievePRoposalObjects",
};

export { TRAFFIC_SIM, EVENTS };
