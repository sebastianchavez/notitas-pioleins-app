import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  plugins: {
    GoogleAuth: {
      scopes: ['profile', 'email'],
      serverClientId: '1054027898479-mu9202e9krmdbljngbc1bjddvnmleehg.apps.googleusercontent.com',
      forceCodeForRefreshToken: true
    }
  },
  appId: 'com.notitaspioleins.app',
  appName: 'Notitas Pioleins',
  webDir: 'www',
  server: {
    androidScheme: 'https'
  }
};

export default config;
