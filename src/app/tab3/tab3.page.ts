import { Component, AfterViewInit } from '@angular/core';
import { Geolocation } from '@capacitor/geolocation';
import { IonicModule } from '@ionic/angular';

// Declare google object globally for TypeScript
declare var google: any;

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
  standalone: true,
  imports: [IonicModule],
})
export class Tab3Page implements AfterViewInit {
  private map: any;
  private markers: any[] = [];

  async ngAfterViewInit() {
    await this.initializeMap();
  }

  async initializeMap() {
    const coordinates = await Geolocation.getCurrentPosition();
    const position = {
      lat: coordinates.coords.latitude,
      lng: coordinates.coords.longitude
    };

    this.map = new google.maps.Map(document.getElementById("map") as HTMLElement, {
      center: position,
      zoom: 15
    });

    // Initial marker at current location
    const currentLocationMarker = new google.maps.Marker({
      position,
      map: this.map,
      title: "You are here!"
    });

    this.markers.push(currentLocationMarker);

    // Enable adding markers by clicking the map
    google.maps.event.addListener(this.map, 'click', (event: any) => {
      this.addCustomMarker(event.latLng);
    });
  }

  async refreshLocation() {
    const coordinates = await Geolocation.getCurrentPosition();
    const position = {
      lat: coordinates.coords.latitude,
      lng: coordinates.coords.longitude
    };

    this.map.setCenter(position);

    // Optional: Remove all previous markers and add a new one
    this.clearMarkers();

    const refreshedMarker = new google.maps.Marker({
      position,
      map: this.map,
      title: "You are here!"
    });

    this.markers.push(refreshedMarker);
  }

  addCustomMarker(latLng: any) {
    const marker = new google.maps.Marker({
      position: latLng,
      map: this.map,
      title: "Custom Marker",
      draggable: true
    });

    this.markers.push(marker);
  }

  addMarkerAtCenter() {
    if (!this.map) return;

    const center = this.map.getCenter();
    const latLng = {
      lat: center.lat(),
      lng: center.lng()
    };

    this.addCustomMarker(latLng);
  }

  clearMarkers() {
    this.markers.forEach(marker => marker.setMap(null));
    this.markers = [];
  }
}
