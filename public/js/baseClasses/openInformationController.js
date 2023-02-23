import { HTML_IDS } from "../constants.js";

export default class OpenInformationController {
  constructor() {
    this.openInformation = $("#" + HTML_IDS.OPEN_INFORMATION.ID);
    this.content = this.openInformation.find(
      "#" + HTML_IDS.OPEN_INFORMATION.CONTENT
    );
    this.top = this.openInformation.find(".top");
    this.bottom = this.openInformation.find(".bottom");
    this.box = this.openInformation.find("#" + HTML_IDS.OPEN_INFORMATION.BOX);
    $("#" + HTML_IDS.OPEN_INFORMATION.CLOSE).on("click", () => {
      this.hide();
    });
    this.isOpen = false;
  }

  getContent() {
    return this.content;
  }

  setWidth(width) {
    this.box.css("width", width);
  }

  show(withTopSection = true) {
    if (withTopSection) {
      this.top.css("visibility", "visible");
    } else {
      this.top.css("visibility", "hidden");
    }
    this.openInformation.css("visibility", "visible");
    this.isOpen = true;
  }

  hide() {
    this.top.css("visibility", "hidden");
    this.openInformation.css("visibility", "hidden");
    this.isOpen = false;
  }

  /**
   * @param content HTML String oder Jquery element
   * @param {Boolean = true}empty Boolean standardmäßig true
   */
  setContent(content, empty = true) {
    if (empty) this.content.empty();
    this.content.append(content);
  }

  setBottom(content, empty = true) {
    if (empty) this.bottom.empty();
    this.bottom.append(content);
  }
}
