export default class InformationBubble {
  constructor(informationBubble, informationBubbleContent) {
    this.informationBubble = informationBubble;
    this.informationBubbleContent = informationBubbleContent;
    this.currentTimeOut;
  }
  show(time, content) {
    if (this.currentTimeOut) {
      clearTimeout(this.currentTimeOut);
    }
    this.informationBubbleContent.html(content);
    this.informationBubble.css("opacity", "1");
    this.currentTimeOut = setTimeout(() => {
      this.hide();
    }, time);
  }
  hide() {
    this.informationBubble.css("opacity", "0");
  }
}
