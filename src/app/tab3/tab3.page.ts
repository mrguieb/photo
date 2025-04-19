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
    // Wait until platform is ready (important for Android)
    await this.initializeMap();
  }

  async initializeMap() {
    // Request current location
    const coordinates = await Geolocation.getCurrentPosition();
    const position = {
      lat: coordinates.coords.latitude,
      lng: coordinates.coords.longitude
    };

    // Initialize Google Map
    this.map = new google.maps.Map(document.getElementById("map") as HTMLElement, {
      center: position,
      zoom: 15
    });

    // Add initial marker at current location
    const currentLocationMarker = new google.maps.Marker({
      position,
      map: this.map,
      title: "You are here!"
    });

    this.markers.push(currentLocationMarker);

    // Enable adding custom markers by clicking the map
    google.maps.event.addListener(this.map, 'click', (event: any) => {
      this.addCustomMarker(event.latLng);
    });
  }

  // Refresh location and move map center
  async refreshLocation() {
    const coordinates = await Geolocation.getCurrentPosition();
    const position = {
      lat: coordinates.coords.latitude,
      lng: coordinates.coords.longitude
    };

    this.map.setCenter(position);

    // Clear existing markers and add a new one
    this.clearMarkers();

    const refreshedMarker = new google.maps.Marker({
      position,
      map: this.map,
      title: "You are here!"
    });

    this.markers.push(refreshedMarker);
  }

  // Add a custom marker at the clicked position
  addCustomMarker(latLng: any) {
    const marker = new google.maps.Marker({
      position: latLng,
      map: this.map,
      title: "Custom Marker",
      draggable: true
    });

    this.markers.push(marker);
  }

  // Add marker at the center of the map
  addMarkerAtCenter() {
    if (!this.map) return;

    const center = this.map.getCenter();
    const latLng = {
      lat: center.lat(),
      lng: center.lng()
    };

    this.addCustomMarker(latLng);
  }

  // Clear all markers from the map
  clearMarkers() {
    this.markers.forEach(marker => marker.setMap(null));
    this.markers = [];
  }
}
