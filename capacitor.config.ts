import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'photo-gallery',
  webDir: 'www',
  plugins: {
    LiveUpdates: {
      appId: 'e05331c6',
      channel: 'Production',
      autoUpdateMethod: 'background',
      maxVersions: 2,
    },
    Camera: {
      saveToGallery: true, // Ensure it's enabled
    },
  },
};

export default config;
