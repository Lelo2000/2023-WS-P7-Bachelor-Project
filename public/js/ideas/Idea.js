import MessageBaseObject from "../baseClasses/messageBaseObject.js";
import { IDEA } from "../constants.js";

export default class Idea extends MessageBaseObject {
  constructor(map) {
    super();
    this.markerPoint;
    this.markerObject;
    this.map = map;
    this.status;
    this.html;
    this.popUp;
  }

  init() {
    this.createHtml();
    this.createPopUp();
  }
  createHtml() {
    let stroke;
    switch (this.status) {
      case IDEA.STATUS.ACTIVE:
        stroke = "idea-greenStroke";
        break;
      case IDEA.STATUS.IDEA:
        stroke = "idea-blueStroke";
        break;
      case IDEA.STATUS.FINISHED:
        stroke = "idea-invisibleStroke";
        break;
    }
    this.html = $(`
    <div class="idea ${this.id} ${stroke}">
    <div class="top"><p class="date">${this.getDate()}</p></div>
    <div class="text">
      <h2>Umgestaltung des Mathildenplatzes</h2>
      <p>
        ${this.text}
      </p>
    </div>
    <div class="bottom flex-spacebetween">
      <p class="comments">${this.getCommentCount()} Kommentare</p>
      <div class="evaluation">
        <img class="icon-like" />
        <img class="icon-dislike" />
      </div>
    </div>
  </div>
    `);
    $(".icon-like", this.html).on("click", () => {
      this.addLike();
    });
  }
  createPopUp() {
    this.popUp = `<b>Autor: ${this.author}</b> <br><br> ${this.text} `;
  }
}
