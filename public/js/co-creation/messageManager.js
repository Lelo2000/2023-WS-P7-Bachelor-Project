import { EVENTS } from "../constants.js";
import Message from "./message.js";

export default class MessageManager {
  constructor(socket) {
    /**@type {Map<Number, Message} */
    this.messages = new Map();
    this.socket = socket;
    /**@type {Map<Number, Message} */
    this.activeMessages = new Map();
    this.playingMessage;
  }

  setPlayingMessage(message) {
    this.playingMessage = message;
  }

  getPlayingMessage() {
    return this.playingMessage;
  }

  addActiveMessage(message) {
    this.activeMessages.set(message.id, message);
  }

  registerEvents() {
    this.socket.on(EVENTS.SERVER.NEW_MESSAGE, (event) => {
      this.addMessage(event.data);
    });

    this.socket.on(EVENTS.SERVER.SEND_MESSAGES, (eventData) => {
      let messages = eventData.messages;
      this.addMessages(messages);
    });
  }

  getMessageChanges(messageId) {
    return this.messages.get(Number(messageId)).changes;
  }

  addMessages(messages) {
    messages.forEach((msg) => {
      this.addMessage(msg);
    });
  }

  addMessage(message) {
    let newMessage = new Message();
    newMessage.fromServerData(message);
    newMessage.dependencies.forEach((dependency, index) => {
      if (!this.messages.has(dependency.id)) {
        console.warn(
          "EINE NACHRICHT OHNE IHRE BENÖTIGTE NACHRICHT GELADEN:",
          dependency
        );
        return;
      }
      this.messages.get(dependency.id).necessaryFor.push(newMessage);
    });
    this.transformDependenciesFromMessage(newMessage);
    this.messages.set(newMessage.id, newMessage);
  }

  transformDependenciesFromMessage(msg) {
    msg.dependencies.forEach((dependency, index) => {
      if (dependency instanceof Message === false) {
        let newMsg = new Message();
        newMsg.fromServerData(dependency);
        this.transformDependenciesFromMessage(newMsg);
        msg.dependencies[index] = newMsg;
      }
    });
  }

  getHtmlAllMessages() {
    let messagesWithOutDependencies = [];
    this.messages.forEach((msg) => {
      if (msg.dependencies.length === 0) messagesWithOutDependencies.push(msg);
    });
    return this.getHtmlOfMessageArray(messagesWithOutDependencies);
  }

  /**@param {Array<Message>} messageArray */
  getHtmlOfMessageArray(messageArray) {
    let html = [];
    messageArray.forEach((message) => {
      html.push(message.html);
    });
    return html;
  }

  /**
   * @param {Message} message
   */
  getMessageWithDependenciesHtml(message) {
    let html = $(`
    <div></div>
    `);
    message.createHtmlWithNecessariesDependendOrder();

    html.append(message.htmlWithNecessaries);
    return html;
  }

  loadDependendSubMessages(currentMessage, subMessage) {
    currentMessage.openDependenciesFromSubMessage(subMessage);
  }
}
