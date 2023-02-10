export default class RealWorldMap {
  constructor(mapContainerId, startPoint) {
    this.mapContainerId = "map";
    this.mapStartPoint = [49.8727994, 8.6471883];
    this.mapStartZoom = 15;
    this.map = L.map(this.mapContainerId).setView(
      this.mapStartPoint,
      this.mapStartZoom
    );
    this.initMap();
    this.initMarker();
    this.bindEvents();
    this.markers = new Map();
  }

  initMap() {
    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution:
        '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(this.map);
  }

  initMarker() {}

  createMarker(point, popUp = false) {
    console.log(point);
    let marker = L.marker(point).addTo(this.map);
    this.setPopUp(marker, popUp);
    this.markers.set(marker._leaflet_id, marker);
    console.log(this.markers);
    return marker;
  }

  setPopUp(marker, popUp) {
    if (popUp) {
      marker.bindPopup(popUp);
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
    let newMarker = this.createMarker(e.latlng);
    this.setPopUp(
      newMarker,
      `<textarea name="text" cols="35" rows="4"></textarea> 	
    <button class="sendButton ${newMarker._leaflet_id}"> Senden </button>`
    );
    console.log(newMarker);
    newMarker.openPopup();
  }
}
