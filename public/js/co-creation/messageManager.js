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
    console.log("Adding new MEssage");
    newMessage.dependencies.forEach((dependency) => {
      if (!this.messages.has(dependency.id)) {
        console.warn(
          "EINE NACHRICHT OHNE IHRE BENÖTIGTE NACHRICHT GELADEN:",
          dependency
        );
        return;
      }
      this.messages.get(dependency.id).necessaryFor.push(newMessage);
      console.log(
        "EINE NACHRICHT ABHÄNGIG GEMACHT UND AN:",
        this.messages.get(dependency.id)
      );
    });
    this.messages.set(newMessage.id, newMessage);
    console.log("NEUE NACHRICHT:", newMessage);
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
      console.log(message);
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
    if (!message.htmlWithNecessaries) {
      message.createHtmlWithNecessaries();
    }

    html.append(message.htmlWithNecessaries);
    return html;
  }
}
