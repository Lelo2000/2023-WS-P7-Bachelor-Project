import { EVENTS, HTML_IDS, IDEA, TEMPORARY } from "../constants.js";
import Idea from "./Idea.js";
import RealWorldMap from "./realWorldMap.js";

const socket = io();

const proposalMap = new RealWorldMap("map", [49.8727994, 8.6471883]);
/**@type {Map<Number, Idea} */
const ideas = new Map();
let currentFoldOut = false;
$(document).ready(function () {
  socket.emit(EVENTS.CLIENT.REQUEST_IDEAS);

  $("#map").on("click", ".sendButton", function (e) {
    const parent = $(e.currentTarget).parent().parent();
    const classes = $(e.currentTarget).attr("class").split(" ");

    const titleElement = parent.find(".title");
    const textAreaElement = parent.find(".text");
    const tagsElement = parent.find(".tags");

    const titleValue = titleElement.val();
    const textAreaValue = textAreaElement.val();
    const tagsValue = tagsElement.val();

    const markerId = classes[1];
    const marker = proposalMap.markers.get(Number(markerId));

    const newIdea = new Idea();
    newIdea.markerPoint = marker._latlng;
    newIdea.text = textAreaValue;
    newIdea.title = titleValue;
    newIdea.author = TEMPORARY.AUTHOR.NAME;
    newIdea.status = IDEA.STATUS.IDEA;
    newIdea.addTags(tagsValue);
    socket.emit(EVENTS.CLIENT.SEND_IDEA, { data: newIdea });
    marker.remove();
  });

  $("#map").on("click", ".abortButton", function (e) {
    const classes = $(e.currentTarget).attr("class").split(" ");
    const markerId = classes[1];
    const marker = proposalMap.markers.get(Number(markerId));
    marker.remove();
  });

  $("#" + HTML_IDS.SIDE_MENU.ID).on("click", ".sideMenuItem", (e) => {
    let menuItem = e.currentTarget;
    foldOut(menuItem.id);
  });
  $("#" + HTML_IDS.FOLD_OUT.BUTTON).on("click", (e) => {
    if (currentFoldOut === false) {
      foldOut(HTML_IDS.SIDE_MENU.ALL);
      return;
    }
    foldOut(currentFoldOut);
  });
  $("#" + HTML_IDS.FOLD_OUT.IDEA_CONTAINER).on(
    "mouseover",
    ".idea",
    function (e) {
      const ideaId = $(e.currentTarget).attr("class").split(" ")[1];
      if (!ideaId) return;
      const idea = ideas.get(Number(ideaId));
      proposalMap.map.setView(idea.markerPoint, 15, { duration: 2 });
    }
  );
  $("#" + HTML_IDS.FOLD_OUT.IDEA_CONTAINER).on("click", ".idea", function (e) {
    const ideaId = $(e.currentTarget).attr("class").split(" ")[1];
    if (!ideaId) return;
    openIdea(ideaId);
  });
});

socket.on(EVENTS.SERVER.NEW_IDEA, (idea) => {
  addIdea(idea.data);
});

function openIdea(ideaId) {
  let ideaOpen = $("#" + HTML_IDS.IDEA_OPEN.ID);
  let ideaSpace = $("#" + HTML_IDS.IDEA_OPEN.IDEA_SPACE);
  ideaSpace.empty();
  let idea = ideas.get(Number(ideaId));
  idea.createHtmlOpen();
  ideaSpace.append(idea.htmlOpen);
  ideaOpen.css("visibility", "visible");
}

window.closeIdeaOpen = closeIdeaOpen;
function closeIdeaOpen() {
  console.log("CLOSE IDEA OPEN");
  let ideaOpen = $("#" + HTML_IDS.IDEA_OPEN.ID);
  ideaOpen.css("visibility", "hidden");
}

function foldOut(menuId) {
  let foldOut = $("#" + HTML_IDS.FOLD_OUT.ID);
  let sideMenu = $("#" + HTML_IDS.SIDE_MENU.ID);
  let sideMenuFoldOutButton = $("#" + HTML_IDS.FOLD_OUT.BUTTON);

  if (currentFoldOut === menuId) {
    foldOut.css("visibility", "hidden");
    sideMenuFoldOutButton.css("left", sideMenu.outerWidth(true) + "px");
    sideMenuFoldOutButton
      .find("img")
      .removeClass("icon-arrow-left")
      .addClass("icon-arrow-right");

    currentFoldOut = false;
    return;
  }
  updateFoldOutToMenuId(menuId);
  currentFoldOut = menuId;
  foldOut.css("visibility", "visible");
  sideMenuFoldOutButton.css(
    "left",
    foldOut.outerWidth(true) + sideMenu.outerWidth(true) + "px"
  );
  sideMenuFoldOutButton
    .find("img")
    .removeClass("icon-arrow-right")
    .addClass("icon-arrow-left");
}

function updateFoldOutToMenuId(menuId) {
  switch (menuId) {
    case HTML_IDS.SIDE_MENU.ALL:
      let allIdeas = Array.from(ideas.values());
      addIdeasToFoldOut(allIdeas);
      break;
    case HTML_IDS.SIDE_MENU.ACTIVE:
      let activeIdeas = filterIdeas([{ status: IDEA.STATUS.ACTIVE }]);
      addIdeasToFoldOut(activeIdeas);
      break;
    case HTML_IDS.SIDE_MENU.FINISHED:
      let finishedIdeas = filterIdeas([{ status: IDEA.STATUS.FINISHED }]);
      addIdeasToFoldOut(finishedIdeas);
      break;
    case HTML_IDS.SIDE_MENU.IDEAS:
      let newIdeas = filterIdeas([{ status: IDEA.STATUS.IDEA }]);
      addIdeasToFoldOut(newIdeas);
      break;
    case HTML_IDS.SIDE_MENU.VIEW:
      break;
  }
}

/**
 * @param {Object} categorieValuePairs [{categorie: value}]
 */
function filterIdeas(categorieValuePairs) {
  let results = [];
  ideas.forEach((idea) => {
    let isPossible = true;
    categorieValuePairs.forEach((categorieValue) => {
      let key = Object.keys(categorieValue)[0];
      if (idea[key] != categorieValue[key]) {
        isPossible = false;
      }
    });
    if (isPossible) results.push(idea);
  });
  return results;
}

function addIdeasToFoldOut(ideaArray) {
  let foldOut = $("#" + HTML_IDS.FOLD_OUT.IDEA_CONTAINER);
  foldOut.empty();
  for (let i = 0; i < ideaArray.length; i++) {
    foldOut.append(ideaArray[i].html);
  }
}

function addIdea(idea) {
  let newIdea = new Idea();
  newIdea.fromServerData(idea);
  newIdea.markerObject = proposalMap.createMarker(
    newIdea.markerPoint,
    newIdea.status,
    newIdea.popUp
  );
  ideas.set(newIdea.id, newIdea);
  updateFoldOutToMenuId(currentFoldOut);
}

socket.on(EVENTS.SERVER.SEND_IDEAS, (ideas) => {
  ideas.data.forEach((idea) => {
    addIdea(idea);
  });
});
