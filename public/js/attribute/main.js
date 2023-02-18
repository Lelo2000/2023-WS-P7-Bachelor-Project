import FoldOutController from "../baseClasses/FoldOutController.js";
import InformationBubble from "../baseClasses/informationBubble.js";
import { HTML_IDS } from "../constants.js";
import Attribute from "./attribute.js";

const socket = io();
window.socket = socket;

let attributeInput = $(".inputAttribute");
const foldOut = $("#" + HTML_IDS.FOLD_OUT.ID);
const sideMenu = $("#" + HTML_IDS.SIDE_MENU.ID);
const sideMenuFoldOutButton = $("#" + HTML_IDS.FOLD_OUT.BUTTON);
const sideMenuFoldOutController = new FoldOutController(
  foldOut,
  sideMenu,
  sideMenuFoldOutButton
);
const informationBubbleContainer = $("#" + HTML_IDS.INFORMATION_BUBBLE.ID);
const informationBubbleContent = $("#" + HTML_IDS.INFORMATION_BUBBLE.CONTENT);
const informationBubble = new InformationBubble(
  informationBubbleContainer,
  informationBubbleContent
);
let currentFoldOut = false;
let attributeList = [];

$(document).ready(function () {
  $("#attributeSpecificBox").on("click", ".addAttribute", function (e) {
    let valueFromInput = attributeInput[0].value;
    let attribute = new Attribute(valueFromInput);
    attributeInput[0].value = "";
    attributeList.push(attribute);
    informationBubble.show(1000, `"${attribute.name}" wurde hinzugefügt`);
  });
  $("#" + HTML_IDS.SIDE_MENU.ID).on("click", ".sideMenuItem", (e) => {
    let menuItem = e.currentTarget;
    onSideMenuClick(menuItem.id);
  });
  $("#" + HTML_IDS.FOLD_OUT.BUTTON).on("click", (e) => {
    if (currentFoldOut === false) {
      onSideMenuClick(HTML_IDS.SIDE_MENU.ATTRIBUTES);
      return;
    }
    onSideMenuClick(currentFoldOut);
  });
});

function onSideMenuClick(menuItemId) {
  if (menuItemId === currentFoldOut) {
    sideMenuFoldOutController.hide();
    currentFoldOut = false;
    return;
  }
  switch (menuItemId) {
    case HTML_IDS.SIDE_MENU.HOME:
      break;
    case HTML_IDS.SIDE_MENU.REDO:
      break;
    case HTML_IDS.SIDE_MENU.UNDO:
      break;
    case HTML_IDS.SIDE_MENU.ATTRIBUTES:
      loadAttributeFoldOut();
      currentFoldOut = menuItemId;
      break;
    case HTML_IDS.SIDE_MENU.COMMENTS:
      break;
    case HTML_IDS.SIDE_MENU.FAQ:
      break;
  }
}

function loadAttributeFoldOut() {
  let title = $("<h1>Attribute:</h1>");
  let attributes = $(`<div class="attributeList"></div>`);
  attributeList.forEach((attribute) => {
    attributes.append(attribute.getHtml());
  });
  sideMenuFoldOutController.setContent(title.add(attributes));

  sideMenuFoldOutController.show();
}
