import { EVENTS, MESSSAGES } from "../../constants.js";
import Message from "../message.js";
import World from "../../simulation/world.js";

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
    /**@type {Map<Number, {activeType: string, message: Message, options:{}}>*/
    this.activeMessages = new Map();
    this.lastMessageSentId;
  }

  setEvents() {
    $(this.messageButtonId).click((e) => {
      e.preventDefault();
      this.sendMessage($(this.messageFieldId).val());
    });

    // this.socket.on(EVENTS.SERVER.NEW_MESSAGE, (serverMsg) => {
    //   let msg = serverMsg.data;
    //   this.recieveMessage(msg);
    // });
  }

  async messageClicked(messageId) {
    let message = this.getMessage(messageId);
    if (this.activeMessages.has(message.id)) {
      if (
        this.activeMessages.get(message.id).activeType ===
        MESSSAGES.ACTIVE_TYPES.DEPENDENCY
      ) {
        this.updateMessageActiveContainer(message);
      } else {
        this.setMessageUnactive(message.id);
      }
    } else {
      this.updateMessageActiveContainer(message);
    }
    await this.world.viewManager.loadMessages(this.activeMessagesAsArray());
  }

  activeMessagesAsArray() {
    let result = [];
    this.activeMessages.forEach((messageContainer) => {
      result.push(messageContainer.message);
    });
    return result;
  }

  setMessageUnactive(messageId) {
    if (!this.activeMessages.has(messageId)) return;
    let messageContainer = this.activeMessages.get(messageId);
    let messageDependencies = messageContainer.message.dependencies;
    this.activeMessages.delete(messageId);
    $(document.getElementById(messageId)).removeClass(
      messageContainer.activeType
    );
    if (messageDependencies.length > 0) {
      messageDependencies.forEach((dependency) => {
        this.setMessageUnactive(dependency.id);
      });
    }
    if (messageContainer.activeType === MESSSAGES.ACTIVE_TYPES.DEPENDENCY) {
      this.setMessageUnactive(messageContainer.options.dependendMessage.id);
    }
  }

  addNewMessageToActive(message, activeType, options) {
    let messageContainer = {
      activeType: activeType,
      message: message,
      options: options,
    };
    this.activeMessages.set(message.id, messageContainer);
    return messageContainer;
  }

  /**@param {Message} message */
  updateMessageActiveContainer(
    message,
    activeType = MESSSAGES.ACTIVE_TYPES.ACTIVE,
    options = {}
  ) {
    let messageContainer;
    if (this.activeMessages.has(message.id)) {
      messageContainer = this.activeMessages.get(message.id);
      // if (messageContainer.type === MESSSAGES.ACTIVE_TYPES.DEPENDENCY) {
      //   //HIER WEITERSCHREIBEN!!!!!!!!!
      // }
      this.setMessageUnactive(messageContainer.id);
    } else {
      messageContainer = this.addNewMessageToActive(
        message,
        activeType,
        options
      );
    }

    $(document.getElementById(message.id)).addClass(
      messageContainer.activeType
    );
    if (message.dependencies.length > 0) {
      message.dependencies.forEach((dependency) => {
        this.updateMessageActiveContainer(
          dependency,
          MESSSAGES.ACTIVE_TYPES.DEPENDENCY,
          {
            dependendMessage: message,
          }
        );
      });
    }
    console.log(this.activeMessages);
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

  async turnOfAllActiveMessages() {
    this.activeMessages.forEach((messageContainer, messageId) => {
      this.setMessageUnactive(messageId);
    });
    await this.world.viewManager.loadMessages(this.activeMessagesAsArray());
  }

  async recieveMessage(message) {
    this.messages.set(message.id, message);
    this.showMessage(message.id);
    if (message.id === this.lastMessageSentId) {
      await this.turnOfAllActiveMessages();
      this.messageClicked(message.id);
    }
  }

  sendMessage(msg) {
    let changes = this.world.viewManager.compareViews(this.world.objectList);
    let message = new Message(msg);
    message.changes = changes;
    message.author = this.author;
    if (this.activeMessages.size > 0) {
      message.addDependencies(this.activeMessagesAsArray());
    }
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
