import { EVENTS } from "../public/js/constants.js";

export default class IdeaManager {
  constructor(io) {
    /**@type {Map<Number, Message>} */
    this.ideas = new Map();
    this.io = io;
    this.ideas.set(0.2837756259578277, {
      text: "Mathilden Höhe",
      author: "Test User",
      time: 1676134963354,
      votes: { likes: 0, dislikes: 0 },
      id: 0.2837756259578277,
      tags: [],
      comments: [],
      markerPoint: { lat: 49.8759698310847, lng: 8.649415969848635 },
      status: "active",
    });
  }

  newConnection(socket) {
    socket.on(EVENTS.CLIENT.SEND_IDEA, (clientMsg) => {
      console.log(clientMsg);
      let idea = clientMsg.data;
      idea.time = Date.now();
      this.addIdea(idea);
      console.log(idea);
    });
    socket.on(EVENTS.CLIENT.REQUEST_IDEAS, () => {
      socket.emit(EVENTS.SERVER.SEND_IDEAS, { data: this.getIdeasInArray() });
    });
  }

  getIdeasInArray() {
    return Array.from(this.ideas.values());
  }

  addIdea(idea) {
    this.ideas.set(idea.id, idea);
    this.io.emit(EVENTS.SERVER.NEW_IDEA, { data: idea });
    console.log(idea);
  }
}
