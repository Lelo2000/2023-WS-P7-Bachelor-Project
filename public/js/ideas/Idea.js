import MessageBaseObject from "../baseClasses/messageBaseObject.js";

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
    this.html = $(`
    <div class="idea ${this.id}">
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
