import { Component, OnInit } from '@angular/core';
import { ActionSheetController, GestureController } from '@ionic/angular';
import { Router } from '@angular/router';
import { PhotoService, UserPhoto } from '../services/photo.service';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  standalone: false,
})
export class Tab2Page implements OnInit {
  constructor(
    public photoService: PhotoService,
    public actionSheetController: ActionSheetController,
    private gestureCtrl: GestureController,
    private router: Router
  ) {}

  async ngOnInit() {
    await this.photoService.loadSaved();
  }

  addPhotoToGallery() {
    this.photoService.addNewToGallery();
  }

  async showActionSheet(photo: UserPhoto, position: number) {
    const actionSheet = await this.actionSheetController.create({
      header: 'Photo Options',
      buttons: [
        {
          text: 'Delete',
          role: 'destructive',
          icon: 'trash',
          handler: () => {
            this.photoService.deletePicture(photo, position);
          }
        },
        {
          text: 'Cancel',
          icon: 'close',
          role: 'cancel',
        }
      ]
    });

    await actionSheet.present();
  }

  ionViewDidEnter() {
    const contentElement = document.querySelector('ion-content');
    if (contentElement) {
      const gesture = this.gestureCtrl.create({
        el: contentElement,
        gestureName: 'swipe-tabs',
        onEnd: (ev) => {
          if (ev.deltaX > -200) {
            // Swipe right to Tab 1
            this.router.navigateByUrl('/tabs/tab1');
          } else if (ev.deltaX < -100) {
            // Swipe left to Tab 3
            this.router.navigateByUrl('/tabs/tab3');
          }
          
        }
      });

      gesture.enable();
    } else {
      console.error('ion-content element not found!');
    }
  }
}
