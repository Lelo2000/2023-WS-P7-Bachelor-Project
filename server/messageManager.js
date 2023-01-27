import { EVENTS } from "../public/js/constants.js";

export default class MessageManager {
  constructor() {
    this.messages = new Map();
  }

  newConnection(socket) {
    socket.on(EVENTS.CLIENT.SEND_MESSAGE, (data) => {
      this.addMessage(data.msg);
    });
  }

  addMessage(msg) {
    this.messages.set(msg.id, msg);
  }
}
