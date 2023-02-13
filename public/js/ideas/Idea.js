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
    this.htmlOpen;
  }

  init() {
    this.createHtml();
    this.createPopUp();
    this.createHtmlOpen();
  }

  createHtmlOpen() {
    this.htmlOpen = $(`
    <div class="ideaLong">
            <div class="top">
              <p class="date">${this.getDate()} ${this.author}</p>
              <img class="icon-cross" />
            </div>
            <div class="text">
              <h2>${this.title}</h2>
              <p>
                ${this.text}
              </p>
            </div>
            <div class="bottom">
              <div class="evaluation flex-spacebetween">
                <img class="icon-like" />
                <img class="icon-dislike" />
              </div>
              <div class="shareButton blackButtonStyle">
                <span>Teilen</span>
              </div>
            </div>
          </div>
          <div class="fullLine"></div>
          <div class="commentSectionLong">
            <h4>Kommentare (${this.comments.length})</h4>
            <div class="writeComment">
              <img class="icon-profile" />
              <input placeholder="Füge einen Kommentar hinzu" />
            </div>
          </div>
          <div class="commentContainer">
            <div class="comment">
              <img class="icon-profile" />
              <div class="mainPart">
                <div class="topPart">
                  <div class="author">Leander Schmidt</div>
                  <div class="date">20.02.2023</div>
                </div>
                <div class="text">
                  Dies sind nur einige Vorschläge, wie wir den Marktplatz
                  barrierefrei gestalten können. Es ist wichtig, dass wir auf
                  die Bedürfnisse aller Besucher eingehen und dass der
                  Marktplatz für alle nutzbar und zugänglich ist. Eine
                  barrierefreie Gestaltung trägt dazu bei, dass alle Bürger am
                  öffentlichen Leben teilnehmen können und dass die Stadt ein
                  angenehmeres und inklusiveres Umfeld wird.
                </div>
                <div class="evaluationAndAnswer">
                  <div class="evaluation flex-spacebetween">
                    <img class="icon-like" /> <img class="icon-dislike" />
                  </div>
                  <div class="answerButton">Antworten</div>
                </div>
                <div class="answers">
                  3 Antworten Anzeigen <img class="icon-arrow-down" />
                </div>
              </div>
            </div>
            <div class="comment">
              <img class="icon-profile" />
              <div class="mainPart">
                <div class="topPart">
                  <div class="author">Leander Schmidt</div>
                  <div class="date">20.02.2023</div>
                </div>
                <div class="text">
                  Dies sind nur einige Vorschläge, wie wir den Marktplatz
                  barrierefrei gestalten können. Es ist wichtig, dass wir auf
                  die Bedürfnisse aller Besucher eingehen und dass der
                  Marktplatz für alle nutzbar und zugänglich ist. Eine
                  barrierefreie Gestaltung trägt dazu bei, dass alle Bürger am
                  öffentlichen Leben teilnehmen können und dass die Stadt ein
                  angenehmeres und inklusiveres Umfeld wird.
                </div>
                <div class="evaluationAndAnswer">
                  <div class="evaluation flex-spacebetween">
                    <img class="icon-like" /> <img class="icon-dislike" />
                  </div>
                  <div class="answerButton">Antworten</div>
                </div>
                <div class="answers">
                  3 Antworten Anzeigen <img class="icon-arrow-down" />
                </div>
              </div>
            </div>
            <div class="comment">
              <img class="icon-profile" />
              <div class="mainPart">
                <div class="topPart">
                  <div class="author">Leander Schmidt</div>
                  <div class="date">20.02.2023</div>
                </div>
                <div class="text">
                  Dies sind nur einige Vorschläge, wie wir den Marktplatz
                  barrierefrei gestalten können. Es ist wichtig, dass wir auf
                  die Bedürfnisse aller Besucher eingehen und dass der
                  Marktplatz für alle nutzbar und zugänglich ist. Eine
                  barrierefreie Gestaltung trägt dazu bei, dass alle Bürger am
                  öffentlichen Leben teilnehmen können und dass die Stadt ein
                  angenehmeres und inklusiveres Umfeld wird.
                </div>
                <div class="evaluationAndAnswer">
                  <div class="evaluation flex-spacebetween">
                    <img class="icon-like" /> <img class="icon-dislike" />
                  </div>
                  <div class="answerButton">Antworten</div>
                </div>
                <div class="answers">
                  3 Antworten Anzeigen <img class="icon-arrow-down" />
                </div>
              </div>
            </div>
          </div>
    `);
    $(".icon-cross", this.htmlOpen).on("click", function () {
      closeIdeaOpen();
    });
  }

  getTextPreview(numberOfWords) {
    let words = this.text.split(" ");
    let result = "";
    if (words.length < numberOfWords) {
      return this.text;
    }
    for (let i = 0; i < numberOfWords; i++) {
      result += " " + words[i];
    }
    result += "...";
    return result;
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
      <h2>${this.title}</h2>
      <p>
        ${this.getTextPreview(10)}
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
    this.popUp = ` <div class="idea ${this.id} ideaPopUp">
    <div class="top"><p class="date">${this.getDate()}</p></div>
    <div class="text">
      <h2>${this.title}</h2>
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
  </div> `;
  }
}
