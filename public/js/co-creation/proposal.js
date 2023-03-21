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
      <img src="/images/proposal-teaser-image.png"/>
      <p>
        ${this.description}
      </p>
      <div class="blackButtonStyle" id="${this.id}">Vorschlag einsehen</div>
    </div>
    `);
  }
}
