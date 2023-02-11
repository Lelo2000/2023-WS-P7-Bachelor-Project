export default class MessageBaseObject {
  constructor() {
    this.text = "";
    this.author = "";
    this.time = 0;
    this.votes = { likes: 0, dislikes: 0 };
    this.id = Math.random();
    this.tags = [];
    this.comments = [];
  }

  init() {}

  fromServerData(data) {
    Object.assign(this, data);
    this.init();
  }

  getText() {
    return this.text;
  }

  getDate() {
    let date = new Date(this.time);
    let month = date.getMonth() + 1;
    month = month < 10 ? "0" + month : mont;
    return `${date.getDate()}.${month}.${date.getFullYear()}`;
  }

  getCommentCount() {
    return this.comments.length;
  }

  addLike() {
    this.votes.likes += 1;
  }

  addDislike() {
    this.votes.dislikes += 1;
  }
}