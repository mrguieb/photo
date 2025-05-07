import { Component, AfterViewInit } from '@angular/core';
import { Geolocation } from '@capacitor/geolocation';
import { IonicModule, GestureController } from '@ionic/angular';
import { Router } from '@angular/router';

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

  constructor(
    private gestureCtrl: GestureController,
    private router: Router
  ) {}

  async ngAfterViewInit() {
    try {
      await this.initializeMap(); // this will trigger the browser's location prompt
      this.setupSwipeGesture();
    } catch (error) {
      console.error('Location permission denied or unavailable:', error);
      alert(
        'Location permission is required to use the map features. Please enable location access in your browser settings.'
      );
    }
  }

  // Initialize Google Map with current location
  async initializeMap() {
    const coordinates = await Geolocation.getCurrentPosition({
      enableHighAccuracy: true,
      timeout: 10000,
    });

    const position = {
      lat: coordinates.coords.latitude,
      lng: coordinates.coords.longitude
    };

    this.map = new google.maps.Map(document.getElementById("map") as HTMLElement, {
      center: position,
      zoom: 15
    });

    const currentLocationMarker = new google.maps.Marker({
      position,
      map: this.map,
      title: "You are here!"
    });

    this.markers.push(currentLocationMarker);

    google.maps.event.addListener(this.map, 'click', (event: any) => {
      this.addCustomMarker(event.latLng);
    });
  }

  // Refresh location and move map center
  async refreshLocation() {
    try {
      const coordinates = await Geolocation.getCurrentPosition({
        enableHighAccuracy: true,
        timeout: 10000,
      });

      const position = {
        lat: coordinates.coords.latitude,
        lng: coordinates.coords.longitude
      };

      this.map.setCenter(position);
      this.clearMarkers();

      const refreshedMarker = new google.maps.Marker({
        position,
        map: this.map,
        title: "You are here!"
      });

      this.markers.push(refreshedMarker);
    } catch (error) {
      console.error('Error refreshing location:', error);
      alert(
        'Unable to get your location. Please make sure location services are enabled in your browser or device settings.'
      );
    }
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

  // Set up swipe gesture to switch tabs
  setupSwipeGesture() {
    const contentElement = document.querySelector('ion-content');

    if (contentElement) {
      const gesture = this.gestureCtrl.create({
        el: contentElement as Node,
        gestureName: 'swipe-tabs',
        onEnd: ev => {
          if (ev.deltaX < -100) {
            this.router.navigateByUrl('/tabs/tab2');
          } else if (ev.deltaX > 100) {
            this.router.navigateByUrl('/tabs/tab1');
          }
        }
      });
      gesture.enable();
    } else {
      console.error('ion-content element not found!');
    }
  }
}
