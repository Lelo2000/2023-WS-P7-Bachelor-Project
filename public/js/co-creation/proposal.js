export default class Proposal {
  constructor() {
    this.name = "";
    this.id = 0;
    this.description = "";
    this.objects = [];
    this.html = "";
  }

  init() {
    this.createHtml();
  }

  fromServerData(data) {
    Object.assign(this, data);
    this.init();
  }

  createHtml() {
    this.html = $(`
    <div class="proposal">
      <h1>${this.name}</h1>
      <img class="icon-arrow-circle-3d" />
      <p>
        ${this.description}
      </p>
      <div class="blackButtonStyle" id="${this.id}">Vorschlag einsehen</div>
    </div>
    `);
  }
}
