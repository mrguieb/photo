import { Component, AfterViewInit } from '@angular/core';
import { Geolocation } from '@capacitor/geolocation';
import { IonicModule } from '@ionic/angular'


declare var google: { maps: { Map: new (arg0: HTMLElement, arg1: { center: { lat: number; lng: number; }; zoom: number; }) => any; Marker: new (arg0: { position: { lat: number; lng: number; }; map: any; title: string; }) => any; }; }

@Component({
selector: 'app-tab3',
templateUrl: 'tab3.page.html',
styleUrls: ['tab3.page.scss'],
standalone: true,
imports: [IonicModule],
})
export class Tab3Page implements AfterViewInit {

async ngAfterViewInit() {
const coordinates = await Geolocation.getCurrentPosition();
const position = {

lat: coordinates.coords.latitude,
lng: coordinates.coords.longitude
};

const map = new google.maps.Map(document.getElementById("map") as HTMLElement, {
center: position,
zoom: 15
});

new google.maps.Marker({
position,
map,
title: "You are here!"
});
}
}