import BottomMenuController from "../baseClasses/bottomMenuController.js";
import FoldOutController from "../baseClasses/FoldOutController.js";
import InformationBubble from "../baseClasses/informationBubble.js";
import OpenInformationController from "../baseClasses/openInformationController.js";
import { EVENTS, HTML_IDS } from "../constants.js";

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
    attributeInput[0].value = "";
  });
  $("#" + HTML_IDS.SIDE_MENU.ID).on("click", ".sideMenuItem", (e) => {
    let menuItem = e.currentTarget;
    onSideMenuClick(menuItem.id);
  });
  $("#" + HTML_IDS.FOLD_OUT.BUTTON).on("click", (e) => {
    if (currentFoldOut === false) {
      onSideMenuClick(HTML_IDS.SIDE_MENU.DISCUSSION);
      return;
    }
    onSideMenuClick(currentFoldOut);
  });
  bottomMenuController.init();

  socket.on(EVENTS.SERVER.SEND_OBJECTS_DATA, (serverMsg) => {
    bottomMenuController.loadObjectsForAdding(serverMsg.data);
  });
  socket.emit(EVENTS.CLIENT.REQUEST_OBJECTS_DATA);
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
    case HTML_IDS.SIDE_MENU.DISCUSSION:
      break;
    case HTML_IDS.SIDE_MENU.EXPERT:
      break;
    case HTML_IDS.SIDE_MENU.PROPOSAL_SWITCH:
      break;
    case HTML_IDS.SIDE_MENU.FAQ:
      break;
  }
}
