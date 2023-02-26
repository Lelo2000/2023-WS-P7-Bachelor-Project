import Message from "../public/js/co-creation/message.js";
import { EVENTS } from "../public/js/constants.js";

export default class MessageManager {
  constructor(io) {
    /**@type {Map<Number, Map<Number, Message>>} */
    this.messages = new Map();
    this.io = io;
  }

  newConnection(socket) {
    socket.on(EVENTS.CLIENT.SEND_MESSAGE, (clientMsg) => {
      let msg = clientMsg.data;
      let proposalId = clientMsg.proposalId;
      msg.time = Date.now();
      this.onAddedMessage(msg);
      this.setMessage(proposalId, msg);
    });
    socket.on(EVENTS.CLIENT.REQUEST_MESSAGES, (propsalData) => {
      let proposalId = propsalData.id;
      socket.emit(EVENTS.SERVER.SEND_MESSAGES, {
        messages: this.getMessages(Number(proposalId)),
      });
    });
  }

  setMessage(proposalId, msg) {
    if (!this.messages.has(proposalId)) {
      this.messages.set(proposalId, new Map());
    }
    this.messages.get(proposalId).set(msg.id, msg);
  }

  loadMessagesFromArray(messages, proposalId) {
    messages.forEach((msg) => {
      this.setMessage(proposalId, msg);
    });
  }

  getMessages(proposalId) {
    if (!this.messages.has(proposalId)) return;
    return Array.from(this.messages.get(proposalId).values());
  }

  onAddedMessage(msg) {
    this.io.emit(EVENTS.SERVER.NEW_MESSAGE, { data: msg });
  }
}
