import { Component, AfterViewInit } from '@angular/core';
import { GestureController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: false,
})
export class Tab1Page implements AfterViewInit {

  constructor(
    private gestureCtrl: GestureController,
    private router: Router
  ) {}

  ngAfterViewInit() {
    const contentElement = document.querySelector('ion-content');
    if (contentElement) {
      const gesture = this.gestureCtrl.create({
        el: contentElement, // Attach gesture to the content
        gestureName: 'swipe-tabs',
        onEnd: (ev) => {
          // Check if the swipe is sufficiently leftward
          if (ev.deltaX < -100) {
            this.router.navigateByUrl('/tabs/tab2'); // Swipe left to Tab2
          }
        }
      });

      gesture.enable(); // Enable gesture
    } else {
      console.error('ion-content element not found!');
    }
  }
}
