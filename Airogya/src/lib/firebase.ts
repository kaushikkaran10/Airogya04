import { initializeApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  "projectId": process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "your-project-id",
  "appId": process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "your-app-id",
  "storageBucket": process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "your-storage-bucket",
  "apiKey": process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "your-firebase-api-key",
  "authDomain": process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "your-auth-domain",
  "measurementId": process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "",
  "messagingSenderId": process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "your-messaging-sender-id"
};


let app;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

const firestore = getFirestore(app);

export { app, firestore };
