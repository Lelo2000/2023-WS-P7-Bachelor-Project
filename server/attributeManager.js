import { EVENTS } from "../public/js/constants.js";

export default class AttributeManager {
  constructor(io) {
    this.attributes = new Map();
    this.attributes.set("Umwelt", { name: "Umwelt", voting: 3, votings: [3] });
    this.attributes.set("Fußgängerfreundlich", {
      name: "Fußgängerfreundlich",
      voting: 3,
      votings: [3],
    });
    this.attributes.set("Fahrradfreundlich", {
      name: "Fahrradfreundlich",
      voting: 3,
      votings: [3],
    });
    this.attributes.set("Gemütlich", {
      name: "Gemütlich",
      voting: 3,
      votings: [3],
    });

    this.io = io;
  }

  newConnection(socket) {
    socket.on(EVENTS.CLIENT.SEND_ATTRIBUTES, (clientMsg) => {
      let attributeList = clientMsg.data;
      this.addAttributes(attributeList);
    });
    socket.on(EVENTS.CLIENT.REQUEST_ATTRIBUTES, () => {
      this.sendAttributes(socket);
    });
  }

  sendAttributes(socket) {
    let attributeList = Array.from(this.attributes.values());
    socket.emit(EVENTS.SERVER.SEND_ATTRIBUTES, { data: attributeList });
  }

  addAttributes(attributeList) {
    attributeList.forEach((attribute) => {
      if (!this.attributes.has(attribute.name)) {
        this.attributes.set(attribute.name, attribute);
      }
      if (attribute.voting > 0)
        this.attributes.get(attribute.name).votings.push(attribute.voting);
      console.log(this.attributes);
    });
  }
}
