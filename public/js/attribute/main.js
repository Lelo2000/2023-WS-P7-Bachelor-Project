import BottomMenuController from "../baseClasses/bottomMenuController.js";
import FoldOutController from "../baseClasses/FoldOutController.js";
import InformationBubble from "../baseClasses/informationBubble.js";
import OpenInformationController from "../baseClasses/openInformationController.js";
import { EVENTS, HTML_IDS } from "../constants.js";
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
const bottomMenu = $("#" + HTML_IDS.BOTTOM_MENU.ID);
const bottomMenuController = new BottomMenuController(bottomMenu);

const openInformation = new OpenInformationController();
let currentFoldOut = false;
let attributeList = [];
let attributeListServer = [];

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
  $("#openSubmitAttribute").on("click", (e) => {
    loadSubmitAttributeOpenInformation();
    openInformation.show();
  });
  $("#openInformation").on("click", "#submitAttributes", (e) => {
    sendAttributesToServer();
    window.location = "/ideas";
  });
  $("#" + HTML_IDS.FOLD_OUT.BUTTON).on("click", (e) => {
    if (currentFoldOut === false) {
      onSideMenuClick(HTML_IDS.SIDE_MENU.ATTRIBUTES);
      return;
    }
    onSideMenuClick(currentFoldOut);
  });
  bottomMenuController.init();

  socket.on(EVENTS.SERVER.SEND_ATTRIBUTES, (serverMsg) => {
    loadAttributesToOpenInformation(serverMsg.data);
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

function loadSubmitAttributeOpenInformation() {
  sideMenuFoldOutController.hide();
  let title = $(`<h1>Reiche deine Anmerkungen ein</h1>`);
  let ownAttributes = $(
    `<div class="attributeList" id="ownAttributeList"></div>`
  );
  attributeList.forEach((attribute) => {
    ownAttributes.append(attribute.getHtml());
  });

  socket.emit(EVENTS.CLIENT.REQUEST_ATTRIBUTES);

  openInformation.setContent(title.add(ownAttributes));
  openInformation.setBottom(`
  <div><div class="blackButtonStyle submitAttributesButton" id="submitAttributes">
  <img class="icon-envelope" />Einreichen
  </div></div>`);
}

function sendAttributesToServer() {
  socket.emit(EVENTS.CLIENT.SEND_ATTRIBUTES, { data: attributeList });
  console.log(attributeListServer);
  if (attributeListServer.length > 0) {
    console.log("ATTRIBUTES TO SERVER");
    socket.emit(EVENTS.CLIENT.SEND_ATTRIBUTES, { data: attributeListServer });
  }
}

function loadAttributesToOpenInformation(serverAttributeList) {
  if (openInformation.isOpen) {
    console.log(serverAttributeList);
    let title = $(`<h1>Weitere Anmerkungen von anderen</h1>`);
    let ownAttributes = $(
      `<div class="attributeList" id="ownAttributeList"></div>`
    );
    attributeListServer = [];
    serverAttributeList.forEach((attribute) => {
      if (hasAttribute(attribute.name)) {
        return;
      }
      let attributeNew = new Attribute(attribute.name);
      attributeNew.voting = 0;
      attributeListServer.push(attributeNew);
      ownAttributes.append(attributeNew.getHtml());
    });
    console.log(ownAttributes);
    console.log("Jeii set Content");
    openInformation.setContent(title.add(ownAttributes), false);
  }
}

function hasAttribute(name) {
  for (let i = 0; i < attributeList.length; i++) {
    if (attributeList[i].name == name) {
      return true;
    }
  }
  return false;
}
