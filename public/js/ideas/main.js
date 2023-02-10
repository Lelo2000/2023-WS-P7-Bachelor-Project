import RealWorldMap from "./realWorldMap.js";

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
    proposalMap.setPopUp(marker, textAreaValue);
  });
});
