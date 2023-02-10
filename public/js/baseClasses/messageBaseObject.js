export default class MessageBaseObject {
  constructor() {
    this.text = "";
    this.author = "";
    this.time = 0;
    this.votes = { positive: 0, negative: 0 };
    this.id = Math.random();
    this.tags = [];
  }

  init() {}
  fromServerData(data) {
    Object.assign(this, data);
    this.init();
  }
  getText() {
    return this.text;
  }
}
