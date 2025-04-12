import { Injectable } from '@angular/core';
import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Preferences } from '@capacitor/preferences';
import { Platform } from '@ionic/angular';
import { Capacitor } from '@capacitor/core';  // Import Capacitor from the correct package

export interface UserPhoto {
  filepath: string;
  webviewPath?: string;
}

@Injectable({
  providedIn: 'root',
})
export class PhotoService {
  public photos: UserPhoto[] = [];
  private PHOTO_STORAGE: string = 'photos';

  constructor(private platform: Platform) {}

  // Add new photo to the gallery
  public async addNewToGallery() {
    const capturedPhoto = await Camera.getPhoto({
      resultType: CameraResultType.Uri,
      source: CameraSource.Camera,
      quality: 100,
    });

    const savedImageFile = await this.savePicture(capturedPhoto);
    this.photos.unshift(savedImageFile);

    // Save photo metadata to preferences
    await Preferences.set({
      key: this.PHOTO_STORAGE,
      value: JSON.stringify(this.photos),
    });
  }

  // Save picture (handles both hybrid and web platforms)
  private async savePicture(photo: Photo): Promise<UserPhoto> {
    const base64Data = await this.readAsBase64(photo);
    const fileName = Date.now() + '.jpeg';

    // Write the file to the filesystem
    const savedFile = await Filesystem.writeFile({
      path: fileName,
      data: base64Data,
      directory: Directory.Data,
    });

    // For hybrid platforms (e.g., mobile devices)
    if (this.platform.is('hybrid')) {
      return {
        filepath: savedFile.uri,
        webviewPath: Capacitor.convertFileSrc(savedFile.uri), // Correct URI handling for hybrid
      };
    } else {
      // For web, use the webPath directly
      return {
        filepath: fileName,
        webviewPath: photo.webPath,
      };
    }
  }

  // Read photo as base64 (platform-specific handling)
  private async readAsBase64(photo: Photo): Promise<string> {
    if (this.platform.is('hybrid')) {
      // Hybrid platform (mobile): Read file from the device's filesystem
      const file = await Filesystem.readFile({
        path: photo.path!,
        directory: Directory.Data,
      });

      return file.data as string;  // Cast to string since it's returned as base64 string
    } else {
      // Web platform: Fetch photo, convert to base64
      const response = await fetch(photo.webPath!);
      const blob = await response.blob();
      return await this.convertBlobToBase64(blob) as string;
    }
  }

  // Helper function to convert Blob to base64 string
  private convertBlobToBase64 = (blob: Blob) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = reject;
      reader.onload = () => resolve(reader.result);
      reader.readAsDataURL(blob);
    });

  // Load saved photos (from Preferences and filesystem)
  public async loadSaved() {
    const { value } = await Preferences.get({ key: this.PHOTO_STORAGE });
    this.photos = (value ? JSON.parse(value) : []) as UserPhoto[];

    // For web platforms, convert the file data to base64
    if (!this.platform.is('hybrid')) {
      for (let photo of this.photos) {
        try {
          const readFile = await Filesystem.readFile({
            path: photo.filepath,
            directory: Directory.Data,
          });

          photo.webviewPath = `data:image/jpeg;base64,${readFile.data}`;
        } catch (error) {
          console.warn('Failed to read photo from filesystem', error);
        }
      }
    }
  }
}
