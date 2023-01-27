import { EVENTS } from "../public/js/constants.js";

export default class MessageManager {
  constructor(io) {
    /**@type {Number, Message} */
    this.messages = new Map();
    this.io = io;
  }

  newConnection(socket) {
    socket.on(EVENTS.CLIENT.SEND_MESSAGE, (clientMsg) => {
      console.log(clientMsg);
      let msg = clientMsg.data;
      msg.time = Date.now();
      this.addMessage(msg);
    });
  }

  addMessage(msg) {
    this.messages.set(msg.id, msg);
    this.io.emit(EVENTS.SERVER.NEW_MESSAGE, { data: msg });
  }
}
