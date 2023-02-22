import BottomMenuController from "../baseClasses/bottomMenuController.js";
import FoldOutController from "../baseClasses/FoldOutController.js";
import InformationBubble from "../baseClasses/informationBubble.js";
import OpenInformationController from "../baseClasses/openInformationController.js";
import { EVENTS, HTML_IDS } from "../constants.js";
import Message from "./message.js";
import MessageManager from "./messageManager.js";

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

const messageManager = new MessageManager(socket);

$(document).ready(function () {
  $("#attributeSpecificBox").on("click", ".addAttribute", function (e) {
    let valueFromInput = attributeInput[0].value;
    attributeInput[0].value = "";
  });
  $("#" + HTML_IDS.BOTTOM_MENU.ID).on("click", "#newContributionOpen", (e) => {
    openNewContribution();
  });
  $("#" + HTML_IDS.OPEN_INFORMATION.ID).on("click", ".addContribution", (e) => {
    sendContribution();
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
  messageManager.registerEvents();

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
  currentFoldOut = menuItemId;
  switch (menuItemId) {
    case HTML_IDS.SIDE_MENU.HOME:
      break;
    case HTML_IDS.SIDE_MENU.REDO:
      break;
    case HTML_IDS.SIDE_MENU.UNDO:
      break;
    case HTML_IDS.SIDE_MENU.DISCUSSION:
      openDiscussionFoldOut();
      sideMenuFoldOutController.show();
      break;
    case HTML_IDS.SIDE_MENU.EXPERT:
      break;
    case HTML_IDS.SIDE_MENU.PROPOSAL_SWITCH:
      break;
    case HTML_IDS.SIDE_MENU.FAQ:
      break;
  }
}

function openDiscussionFoldOut() {
  sideMenuFoldOutController.setContent(`
    <div class="flex-spacebetween">
        <h1>Diskussionen</h1>
        <div class="flex-spacebetween funelTagSpace">
          <img class="icon-funnel" /> <img class="icon-burger-diagonal" />
        </div>
    </div>
    <div class="searchSpace">
        <input type="text" class="search" placeholder="Durchsuchen" />
        <img class="icon-search" />
    </div>
    <div class="tabMenu">
        <div class="tabMenuPoint active"><span>Alle</span></div>
        <div class="tabMenuPoint"><span>Aktive</span></div>
        <div class="tabMenuPoint"><span>Anfragen</span></div>
        <div class="tabMenuPoint"><span>Meine</span></div>
    </div>
    <div id="discussionMessagesContainer"></div>`);

  $("#discussionMessagesContainer").append(messageManager.getHtmlAllMessages());
}

function sendContribution() {
  let content = openInformation.getContent();
  let title = content.find("#titleNewContribution").val();
  let text = content.find(".text").val();
  let tags = content.find(".tag-filter").val();
  let newMessage = new Message();
  newMessage.title = title;
  newMessage.text = text;
  newMessage.addTags(tags);
  console.log(newMessage);
  socket.emit(EVENTS.CLIENT.SEND_MESSAGE, { data: newMessage });
  openInformation.hide();
}

function openNewContribution() {
  openInformation.setWidth("450px");

  let content = `
  <div class="newContributionForm">
    <h3>Beitrag erstellen</h3>
    <div class="information">
      <img class="icon-information" /><span
        >Alle vorgenommenen Änderungen werden in den Beitrag
        hinzugefügt.</span
      >
      <div class="edit">Bearbeiten</div>
    </div>
    <input
      type="text"
      id="titleNewContribution"
      placeholder="Titel des Beitrags"
    />
    <textarea class="text" cols="35" rows="8"> </textarea>
    <input
      list="tags"
      class="tag-filter"
      placeholder="Tags auswählen"
    />
    <div class="bottom">
      <div class="blackButtonStyle addContribution">Weiter</div>
    </div>
  </div>
  `;
  openInformation.setContent(content);
  openInformation.show();
}
