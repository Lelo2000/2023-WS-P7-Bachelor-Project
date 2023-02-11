import { EVENTS, IDEA, TEMPORARY } from "../constants.js";
import Idea from "./Idea.js";
import RealWorldMap from "./realWorldMap.js";

const socket = io();

const proposalMap = new RealWorldMap("map", [49.8727994, 8.6471883]);
const ideas = new Map();
$(document).ready(function () {
  socket.emit(EVENTS.CLIENT.REQUEST_IDEAS);

  $("#map").on("click", ".sendButton", function (e) {
    const parent = $(e.target).parent();
    const children = parent.children();
    const textAreaValue = $(children[0]).val();
    const classes = $(e.target).attr("class").split(" ");
    const markerId = classes[1];
    const marker = proposalMap.markers.get(Number(markerId));
    const newIdea = new Idea();
    newIdea.markerPoint = marker._latlng;
    newIdea.text = textAreaValue;
    newIdea.author = TEMPORARY.AUTHOR.NAME;
    newIdea.status = IDEA.STATUS.IDEA;
    socket.emit(EVENTS.CLIENT.SEND_IDEA, { data: newIdea });
    marker.remove();
  });
  $("#ideaContainer").on("mouseover", ".idea", function (e) {
    const ideaId = $(e.currentTarget).attr("class").split(" ")[1];
    if (!ideaId) return;
    console.log(ideas.get(Number(ideaId)));
  });
});

socket.on(EVENTS.SERVER.NEW_IDEA, (idea) => {
  addIdea(idea.data);
});

function addIdea(idea) {
  let newIdea = new Idea();
  newIdea.fromServerData(idea);
  newIdea.markerObject = proposalMap.createMarker(
    newIdea.markerPoint,
    newIdea.status,
    newIdea.popUp
  );
  $("#ideaContainer").append(newIdea.html);
  ideas.set(newIdea.id, newIdea);
}

socket.on(EVENTS.SERVER.SEND_IDEAS, (ideas) => {
  ideas.data.forEach((idea) => {
    addIdea(idea);
  });
});
