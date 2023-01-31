export default class Message {
  constructor(text) {
    this.categorie = "testCategorie";
    this.text = text;
    this.author = "";
    this.time = 0;
    this.votes = { positive: 0, negative: 0 };
    this.id = Math.random();
    this.tags = [];
    this.changes = [];
    this.dependencies = [];
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
