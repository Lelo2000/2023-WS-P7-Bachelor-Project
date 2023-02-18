export default class Attribute {
  constructor(name) {
    this.name = name;
    this.voting = 0;
    this.stars = [];
  }

  getHtml() {
    if (this.stars.length != 5) {
      this.generateStars();
    }
    this.showStarsWithUpdate();
    let html = $(`
    <div class="attribute">
    <div>${this.name}</div>
    <div class="starRow">
    </div>
  </div>
    `);
    for (let i = 0; i < this.stars.length; i++) {
      $(".starRow", html).append(this.stars[i]);
    }

    return html;
  }

  generateStars() {
    for (let i = 1; i < 6; i++) {
      let star = $(`<img class="icon-star-outline" value="${i}" />`);
      star.on("click", (e) => {
        this.setVoting(i);
      });
      this.stars.push(star);
    }
  }

  setVoting(voting) {
    this.voting = Number(voting);
    this.showStarsWithUpdate();
  }

  showStarsWithUpdate() {
    for (let i = 0; i < this.stars.length; i++) {
      let star = this.stars[i];
      if (i < this.voting) {
        console.log("Im Voting Ding");
        if (star.hasClass("icon-star-outline"))
          star.removeClass("icon-star-outline");
        if (!star.hasClass("icon-star-filled"))
          star.addClass("icon-star-filled");
      } else {
        if (star.hasClass("icon-star-filled"))
          star.removeClass("icon-star-filled");
        if (!star.hasClass("icon-star-outline"))
          star.addClass("icon-star-outline");
      }
    }
  }
}
