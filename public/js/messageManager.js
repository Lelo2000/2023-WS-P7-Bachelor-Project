import { EVENTS } from "./constants.js";
import Message from "./message.js";
import World from "./world.js";

export default class MessageManager {
  /**
   * @param {World} world
   */
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
    this.activeMessages = new Map();
    this.lastMessageSentId;
  }

  setEvents() {
    $(this.messageButtonId).click((e) => {
      e.preventDefault();
      this.sendMessage($(this.messageFieldId).val());
    });

    this.socket.on(EVENTS.SERVER.NEW_MESSAGE, (serverMsg) => {
      let msg = serverMsg.data;
      this.recieveMessage(msg);
    });
  }

  messageClicked(messageId) {
    let message = this.getMessage(messageId);
    if (this.activeMessages.has(message.id)) {
      this.setMessageUnactive(message);
    } else {
      this.setMessageActive(message);
    }
    this.world.viewManager.loadMessages([...this.activeMessages.values()]);
  }

  setMessageUnactive(message) {
    $(document.getElementById(message.id)).removeClass("active");
    this.activeMessages.delete(message.id);
  }

  setMessageActive(message) {
    this.activeMessages.set(message.id, message);
    let htmlId = "#" + message.id;
    $(document.getElementById(message.id)).addClass("active");
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
    // console.log($("#" + message.id));
    // $("#" + message.id).on("click", (function (e) {
    //   e.preventDefault();
    //   console.log("clicked");
    //   showChange(message.id);
    // });
  }

  recieveMessage(message) {
    this.messages.set(message.id, message);
    this.showMessage(message.id);
    console.log("NEUE NACHRICHT VOM SERVER:", message);
    if (message.id === this.lastMessageSentId) {
      this.messageClicked(message.id);
    }
  }

  sendMessage(msg) {
    let changes = this.world.viewManager.compareViews(this.world.objectList);
    let message = new Message(msg);
    message.changes = changes;
    message.author = this.author;
    this.socket.emit(EVENTS.CLIENT.SEND_MESSAGE, { data: message });
    this.lastMessageSentId = message.id;
  }

  getMessage(idParam) {
    let id = idParam;
    if (typeof id === "string") {
      id = Number(id);
    }
    if (this.messages.has(id)) {
      return this.messages.get(id);
    } else {
      console.error("ES GIBT KEINE NACHRICHT MIT DER ID", id, this.messages);
      return;
    }
  }
}
