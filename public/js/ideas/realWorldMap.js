import { IDEA } from "../constants.js";
import markerBig from "./markerBig.js";
import markerSmall from "./markerSmall.js";

export default class RealWorldMap {
  constructor(mapContainerId, startPoint) {
    this.mapContainerId = mapContainerId;
    this.mapStartPoint = startPoint;
    this.mapStartZoom = 15;
    this.map = L.map(this.mapContainerId, { zoomControl: false }).setView(
      this.mapStartPoint,
      this.mapStartZoom
    );
    this.initMap();
    this.initMarker();
    this.bindEvents();
    this.markers = new Map();
    let zoom = L.control.zoom({ position: "bottomright" });
    zoom.addTo(this.map);
  }

  initMap() {
    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution:
        '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(this.map);
  }

  initMarker() {}

  createMarker(point, icon, popUp = false) {
    let newIcon;
    switch (icon) {
      case IDEA.STATUS.ACTIVE:
        newIcon = new markerBig({
          iconUrl: "../../images/icons/leaflet/marker_active.svg",
        });
        break;
      case IDEA.STATUS.FINISHED:
        newIcon = new markerSmall({
          iconUrl: "../../images/icons/leaflet/marker_finished.svg",
        });
        break;
      case IDEA.STATUS.IDEA:
        newIcon = new markerSmall({
          iconUrl: "../../images/icons/leaflet/marker_idea.svg",
        });
        break;
      default:
        newIcon = new markerSmall({
          iconUrl: "../../images/icons/leaflet/marker_finished.svg",
        });
    }
    let marker = L.marker(point, { icon: newIcon }).addTo(this.map);
    this.setPopUp(marker, popUp);
    this.markers.set(marker._leaflet_id, marker);
    marker.on("remove", () => {
      this.markers.delete(marker._leaflet_id);
    });
    return marker;
  }

  setPopUp(marker, popUp, destroyIfClosed = false) {
    if (popUp) {
      marker.bindPopup(popUp, { maxWidth: 500, closeButton: false });
      marker.on("popupclose", () => {
        if (destroyIfClosed) marker.remove();
      });
    }
  }

  bindEvents() {
    this.map.on("click", (e) => {
      this.onMapClicked(e);
    });
  }

  /**@param {Event} e */
  onMapClicked(e) {
    e.originalEvent.preventDefault();
    let newMarker = this.createMarker(e.latlng, IDEA.STATUS.IDEA);
    this.setPopUp(
      newMarker,
      `<div id="markerPopUpNewIdea">
      <h3>Idee Einreichen</h3>
      <input class="title" placeholder="Titel der Idee"></input>
      <textarea class="text" name="text" cols="35" rows="4" placeholder="Beschreibung der Idee"></textarea>
      <input class="tags" placeholder="Tags"></input>
      <div class="buttonContainer">
      <div class="abortButton ${newMarker._leaflet_id}"> <span>Abbrechen</span> </div>
      <div class="sendButton ${newMarker._leaflet_id} blackButtonStyle"> <span>Einreichen</span> </div>
      <div>
      </div>
      `,
      true
    );
    newMarker.openPopup();
  }
}
