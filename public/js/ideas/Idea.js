import MessageBaseObject from "../baseClasses/messageBaseObject.js";

export default class Idea extends MessageBaseObject {
  constructor() {
    super();
    this.marker;
    this.status;
    this.html;
    this.popUp;
  }

  init() {
    this.createHtml();
    this.createPopUp();
  }
  createHtml() {}
  createPopUp() {
    this.popUp = `<b>Autor: ${this.author}</b> <br><br> ${this.text} `;
  }
}
