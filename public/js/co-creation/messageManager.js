import { EVENTS } from "../constants.js";
import Message from "./message.js";

export default class MessageManager {
  constructor(socket) {
    /**@type {Map<Number, Message} */
    this.messages = new Map();
    this.socket = socket;
  }

  registerEvents() {
    this.socket.on(EVENTS.SERVER.NEW_MESSAGE, (event) => {
      this.addMessage(event.data);
    });
  }

  addMessage(message) {
    let newMessage = new Message();
    newMessage.fromServerData(message);
    this.messages.set(newMessage.id, newMessage);
  }

  getHtmlAllMessages() {
    return this.getHtmlOfMessageArray(Array.from(this.messages.values()));
  }

  /**@param {Array<Message>} messageArray */
  getHtmlOfMessageArray(messageArray) {
    let html = [];
    messageArray.forEach((message) => {
      console.log(message);
      html.push(message.html);
    });
    return html;
  }
}
