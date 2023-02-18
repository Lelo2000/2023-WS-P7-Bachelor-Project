export default class FoldOutController {
  constructor(foldOut, sideMenu, foldOutButton) {
    this.foldOut = foldOut;
    this.sideMenu = sideMenu;
    this.foldOutButton = foldOutButton;
  }
  show() {
    this.foldOut.css("visibility", "visible");
    this.foldOutButton.css(
      "left",
      this.foldOut.outerWidth(true) + this.sideMenu.outerWidth(true) + "px"
    );
    this.foldOutButton
      .find("img")
      .removeClass("icon-arrow-right")
      .addClass("icon-arrow-left");
  }
  hide() {
    this.foldOut.css("visibility", "hidden");

    this.foldOutButton.css("left", this.sideMenu.outerWidth(true) + "px");
    this.foldOutButton
      .find("img")
      .removeClass("icon-arrow-left")
      .addClass("icon-arrow-right");
  }

  /**
   * @param content Html String oder jquery Elemente.
   * @param empty Boolean ob der alte Content vorher entfernt werden soll.
   */
  setContent(content, empty = true) {
    if (empty) this.empty();
    this.foldOut.append(content);
  }
  empty() {
    this.foldOut.empty();
  }
}
