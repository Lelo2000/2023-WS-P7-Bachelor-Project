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
    ${this.getTopHtml()}
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
      <div class="dependendMessageContainer 0">
     
      </div>
  </div>
    `);
    console.log(this.necessaryFor);
    this.necessaryFor.forEach((dependendMessage, index) => {
      let listLastDependcies = [];
      dependendMessage.getLastMessagesBasedOnThisOne(listLastDependcies);
      console.log(listLastDependcies);
      $(`.dependendMessageContainer.${index}`, this.htmlWithNecessaries).append(
        `
        <div class="dependendMessageContainer ${Number(index) + 1}"></div>
        <div class="messagesBefore">
        <span>(5 weitere Kommentare)</span><img class="icon-arrow-down"></div>
        <div class="dependendMessage ${index}"></div>`
      );
      $(`.dependendMessage.${index}`, this.htmlWithNecessaries).append(
        dependendMessage.html
      );
    });

    $(".icon-like", this.htmlWithNecessaries).on("click", () => {
      this.addLike();
    });
  }
  createHtmlWithNecessariesDependendOrder() {
    this.htmlWithNecessaries = $(`
    <div class="message ${this.id}">
   ${this.getTopHtml()}
    ${this.getTextHtml()}
    ${this.getBottomAnwserButtonBar()}
      <div class="dependendMessageContainer">
     
      </div>
  </div>
    `);
    let allLastDependecies = [];
    this.necessaryFor.forEach((dependendMessage) => {
      let newValues = [];
      dependendMessage.getLastMessagesBasedOnThisOne(newValues);
      allLastDependecies.push(newValues);
    });
    console.log("LOAD ALL DEPENDECIES:", allLastDependecies);
    allLastDependecies.forEach((necessaryForList, index) => {
      let sameDependendMessageContainer = $(
        `<div class="sameDependendMessageContainer ${index}"></div>`
      );
      $(`.dependendMessageContainer`, this.htmlWithNecessaries).append(
        sameDependendMessageContainer
      );

      necessaryForList.forEach((msg) => {
        sameDependendMessageContainer.append(msg.getMessageAsSubMessage());
      });
    });
  }

  getMessageAsSubMessage() {
    let messageBefore = "";
    let depCount = this.getAllDependencyCount();
    if (depCount > 1) {
      messageBefore = `
        <div class="dependenciesFromSubMessage"></div>
          <div class="messagesBefore ${this.id}">
            <span>(${
              depCount - 1
            } weitere Kommentare)</span><img class="icon-arrow-down">
          </div>
          `;
    }
    return `
    <div class="subMessage ${this.id}">
    ${messageBefore}
    ${this.getTopHtml()}
    ${this.getTextHtml()}
    ${this.getBottomAnwserButtonBar()}
    </div>
    `;
  }

  /**@param {Message} subMessage */
  openDependenciesFromSubMessage(subMessage) {
    let dependenciesFromSubMessage = $("<div></div>");
    console.log(subMessage);
    subMessage.dependencies.forEach((message) => {
      dependenciesFromSubMessage.append(message.getMessageAsSubMessage());
    });
    this.closeDependenciesFromSubMessage(subMessage);
    this.htmlWithNecessaries
      .find(`.subMessage.${subMessage.id} .dependenciesFromSubMessage`)
      .append(dependenciesFromSubMessage);
  }

  /**@param {Message} subMessage */
  closeDependenciesFromSubMessage(subMessage) {
    this.htmlWithNecessaries
      .find(`.subMessage.${subMessage.id} .dependenciesFromSubMessage`)
      .empty();
  }

  getAllDependencyCount() {
    let i = this.dependencies.length;
    if (i > 0) {
      this.dependencies.forEach((dependecie) => {
        let checkedDependency = dependecie;
        if (dependecie instanceof Message === false) {
          let newMsg = new Message();
          newMsg.fromServerData(dependecie);
          checkedDependency = newMsg;
        }
        i += checkedDependency.getAllDependencyCount();
      });
    }
    return i;
  }

  getAllNecessaryForCount() {
    let i = this.necessaryFor.length;
    if (i > 0) {
      this.necessaryFor.forEach((necessary) => {
        let necessaryChecked = necessary;
        if (necessary instanceof Message === false) {
          let newMsg = new Message();
          newMsg.fromServerData(necessary);
          necessaryChecked = newMsg;
        }
        i += necessaryChecked.getAllNecessaryForCount();
      });
    }
    return i;
  }

  getLastMessagesBasedOnThisOne(finishedList) {
    if (this.necessaryFor.length > 0) {
      this.necessaryFor.forEach((msg) => {
        msg.getLastMessagesBasedOnThisOne(finishedList);
      });
    } else {
      finishedList.push(this);
    }
  }
  // Ich schaue ob ich abhängigkeiten habe
  // Wenn ja gehe ich Nehme ich alle diese Abhängigkeiten und schaue ob diese welche haben
  // wenn nein dann bin ich Teil des gesuchte Ergebnis

  getTopHtml() {
    let playIcon = "";
    if (this.changes.length > 0) {
      playIcon = `<div class="tagIcon playMessage" id="${this.id}">
      <img class="icon-play">
    </div>`;
    }

    return `<div class="top">
      <div class="profileContainer">
        <img class="icon-profile profile">
        <div class="authorDate"> 
          <p class="author">${this.author}</p>
          <p class="date">${this.getDate()}</p>
        </div>
      </div>
      ${playIcon}
    </div>`;
  }

  getTextHtml() {
    return `<div class="text">
<h2>${this.title}</h2>
<p>
  ${this.text}
</p>
</div>`;
  }

  createHtml() {
    this.html = $(`
    <div class="message ${this.id}">
    ${this.getTopHtml()}
    ${this.getTextHtml()}
    ${this.getBottomBar()}
  </div>
    `);
    $(".icon-like", this.html).on("click", () => {
      this.addLike();
    });
  }

  getBottomAnwserButtonBar() {
    let bottomSpaceAfterComments = "";
    bottomSpaceAfterComments = `
    <div class="bottom">
      <span>Antworten</span>
      <div class="evaluation">
        <img class="icon-like" />
        <img class="icon-dislike" />
      </div>
    </div>`;
    return bottomSpaceAfterComments;
  }

  getBottomBar() {
    let bottomSpaceAfterComments = "";
    bottomSpaceAfterComments = `
    <div class="bottom">
      <span> ${this.getAllNecessaryForCount()} Antworten</span>
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
