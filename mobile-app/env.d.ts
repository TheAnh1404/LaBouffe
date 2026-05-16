/**
 * Type declarations for environment variables.
 * These are loaded from .env file via react-native-dotenv.
 */

declare module '@env' {
  export const FIREBASE_API_KEY: string;
  export const FIREBASE_AUTH_DOMAIN: string;
  export const FIREBASE_PROJECT_ID: string;
  export const FIREBASE_STORAGE_BUCKET: string;
  export const FIREBASE_MESSAGING_SENDER_ID: string;
  export const FIREBASE_APP_ID: string;
  export const FIREBASE_MEASUREMENT_ID: string;
}
