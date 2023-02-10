import { EVENTS, IDEA, TEMPORARY } from "../constants.js";
import Idea from "./Idea.js";
import RealWorldMap from "./realWorldMap.js";

const socket = io();

let proposalMap = new RealWorldMap("map", [49.8727994, 8.6471883]);
$(document).ready(function () {
  $("#map").on("click", ".sendButton", function (e) {
    console.log(e);
    const parent = $(e.target).parent();
    const children = parent.children();
    const textAreaValue = $(children[0]).val();
    console.log(textAreaValue);
    const classes = $(e.target).attr("class").split(" ");
    console.log(classes);
    const markerId = classes[1];
    const marker = proposalMap.markers.get(Number(markerId));
    console.log(marker);
    const newIdea = new Idea();
    newIdea.marker = marker._latlng;
    newIdea.text = textAreaValue;
    newIdea.author = TEMPORARY.AUTHOR.NAME;
    newIdea.status = IDEA.STATUS.IDEA;
    socket.emit(EVENTS.CLIENT.SEND_IDEA, { data: newIdea });
    marker.remove();
  });
});

socket.on(EVENTS.SERVER.NEW_IDEA, (idea) => {
  let newIdea = new Idea();
  newIdea.fromServerData(idea.data);
  proposalMap.createMarker(newIdea.marker, newIdea.popUp);
  $("#ideaContainer").append(newIdea.html);
});
