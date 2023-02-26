import MessageBaseObject from "../baseClasses/messageBaseObject.js";

export default class Message extends MessageBaseObject {
  constructor() {
    super();
    this.categorie = "testCategorie";
    this.changes = [];
    this.dependencies = [];
    this.necessaryFor = [];
    this.answers = [];
    this.html = "";
    this.htmlWithNecessaries = "";
    this.author = "Test autor";
  }

  init() {
    this.createHtml();
  }

  createHtmlWithNecessaries() {
    this.htmlWithNecessaries = $(`
    <div class="message ${this.id}">
    <div class="top">
      <div class="profileContainer">
        <img class="icon-profile profile">
        <div class="authorDate"> 
          <p class="author">${this.author}</p>
          <p class="date">${this.getDate()}</p>
        </div>
      </div>
      <div class="tagIcon playMessage" id="${this.id}">
        <img class="icon-play">
      </div>
    </div>
    <div class="text">
      <h2>${this.title}</h2>
      <p>
        ${this.text}
      </p>
    </div>
    <div class="bottom">
      <span>Antworten</span>
      <div class="evaluation">
        <img class="icon-like" />
        <img class="icon-dislike" />
      </div>
    </div>
      <div class="dependendMessageContainer">
        <div class="messagesBefore">
        <span>(5 weitere Kommentare)</span><img class="icon-arrow-down"></div>
        <div class="dependendMessage"></div>
      </div>
  </div>
    `);

    $(".dependendMessage", this.htmlWithNecessaries).append(
      this.necessaryFor[0].html
    );

    $(".icon-like", this.htmlWithNecessaries).on("click", () => {
      this.addLike();
    });
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
      <div class="tagIcon playMessage" id="${this.id}">
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
    bottomSpaceAfterComments = `
    <div class="bottom">
      <span> ${this.answers.length} Antworten</span>
      <div class="evaluation">
        <img class="icon-like" />
        <img class="icon-dislike" />
      </div>
    </div>`;
    return bottomSpaceAfterComments;
  }

  addChanges(changeArray) {
    this.changes = this.changes.concat(changeArray);
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
