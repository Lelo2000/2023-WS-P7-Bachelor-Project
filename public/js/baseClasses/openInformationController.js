import { HTML_IDS } from "../constants.js";

export default class OpenInformationController {
  constructor() {
    this.openInformation = $("#" + HTML_IDS.OPEN_INFORMATION.ID);
    this.content = this.openInformation.find(
      "#" + HTML_IDS.OPEN_INFORMATION.CONTENT
    );
    this.bottom = this.openInformation.find(".bottom");

    $("#" + HTML_IDS.OPEN_INFORMATION.CLOSE).on("click", () => {
      this.hide();
    });
  }

  show() {
    this.openInformation.css("visibility", "visible");
  }

  hide() {
    this.openInformation.css("visibility", "hidden");
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
