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
  createHtml() {
    this.html = `
      <div class="idea" >Autor: ${this.author}</b> <br><br> ${this.text}</div>
    `;
  }
  createPopUp() {
    this.popUp = `<b>Autor: ${this.author}</b> <br><br> ${this.text} `;
  }
}
