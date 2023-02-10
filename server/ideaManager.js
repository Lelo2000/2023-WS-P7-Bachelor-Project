import { EVENTS } from "../public/js/constants.js";

export default class IdeaManager {
  constructor(io) {
    /**@type {Number, Message} */
    this.ideas = new Map();
    this.io = io;
  }

  newConnection(socket) {
    socket.on(EVENTS.CLIENT.SEND_IDEA, (clientMsg) => {
      console.log(clientMsg);
      let idea = clientMsg.data;
      idea.time = Date.now();
      this.addIdea(idea);
      console.log(idea);
    });
  }

  addIdea(idea) {
    this.ideas.set(idea.id, idea);
    this.io.emit(EVENTS.SERVER.NEW_IDEA, { data: idea });
  }
}
