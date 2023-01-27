import { EVENTS } from "./constants.js";
import Message from "./message.js";

export default class MessageManager {
  constructor(socket, world, messageFieldId, messageButtonId, messageArea) {
    this.world = world;
    this.socket = socket;
    /**@type {Map<Number, Message>} */
    this.messages = new Map();
    this.messageFieldId = messageFieldId;
    this.messageButtonId = messageButtonId;
    this.messageArea = messageArea;
    this.setEvents();
    this.author = Math.random().toFixed(4);
  }

  setEvents() {
    $(this.messageButtonId).click((e) => {
      e.preventDefault();
      this.sendMessage($(this.messageFieldId).val());
    });
    this.socket.on(EVENTS.SERVER.NEW_MESSAGE, (serverMsg) => {
      let msg = serverMsg.data;
      this.messages.set(msg.id, msg);
      this.showMessage(msg.id);
      console.log("NEUE NACHRICHT VOM SERVER:", msg);
    });
  }

  showMessage(id) {
    let message = this.messages.get(id);
    if (!message) return;
    $(this.messageArea).append(`
    <div class="message" id="${message.id}">
    <p class="message-author">
      ${message.author}
    </p>
    <p class="message-text">
    ${message.text}
    </p>
  </div>`);
  }

  sendMessage(msg) {
    let message = new Message(msg);
    message.author = this.author;
    this.socket.emit(EVENTS.CLIENT.SEND_MESSAGE, { data: message });
  }
}
