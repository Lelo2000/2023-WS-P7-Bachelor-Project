import MessageBaseObject from "../baseClasses/messageBaseObject.js";

export default class Message extends MessageBaseObject {
  constructor() {
    super();
    this.categorie = "testCategorie";
    this.changes = [];
    this.dependencies = [];
    this.html = "";
    this.author = "Test autor";
  }

  init() {
    console.log("INIT");
    this.createHtml();
  }

  createHtml() {
    this.html = $(`
    <div class="message ${this.id}">
    <div class="top">
      <div class="profileContainer">
        <img class="icon-profile profile">
        <div class="authorDate"> 
          <p class="author">${this.author}</p>
          <p class="date">${this.getDate()}</p>
        </div>
      </div>
      <div class="tagIcon">
        <img class="icon-play">
      </div>
    </div>
    <div class="text">
      <h2>${this.title}</h2>
      <p>
        ${this.text}
      </p>
    </div>
    ${this.getBottomBar()}
  </div>
    `);
    $(".icon-like", this.html).on("click", () => {
      this.addLike();
    });
  }

  getBottomBar() {
    let bottomSpaceAfterComments = "";
    bottomSpaceAfterComments = `<div class="evaluation">
    <img class="icon-like" />
    <img class="icon-dislike" />
  </div>`;
    return bottomSpaceAfterComments;
  }

  addDependency(message) {
    this.dependencies.push(message);
  }

  /**@param {Array<Message>} */
  addDependencies(messages) {
    for (let message of messages) {
      if (message.id !== this.id) this.dependencies.push(message);
    }
  }
}
