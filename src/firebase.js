import { initializeApp } from 'firebase/app';
import { 
  getFirestore, 
  enableIndexedDbPersistence,
  CACHE_SIZE_UNLIMITED 
} from 'firebase/firestore';
import { 
  getAuth, 
  setPersistence, 
  browserLocalPersistence,
  browserSessionPersistence
} from 'firebase/auth';
import { getStorage } from 'firebase/storage';
import { getAnalytics, isSupported } from 'firebase/analytics';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBuy_d7fw6bL7r5pvp5_8wphOKwzNX6HIY",
  authDomain: "almaarhjcloud.firebaseapp.com",
  projectId: "almaarhjcloud",
  storageBucket: "almaarhjcloud.appspot.com",
  messagingSenderId: "942264472811",
  appId: "1:942264472811:web:60c482f11600deef251aae",
  measurementId: "G-91VGSK429J"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);

// Enable offline persistence
try {
  enableIndexedDbPersistence(db, { 
    cacheSizeBytes: CACHE_SIZE_UNLIMITED 
  });
  console.log("Offline persistence enabled");
} catch (err) {
  if (err.code == 'failed-precondition') {
    console.warn("Offline persistence can only be enabled in one tab at a time.");
  } else if (err.code == 'unimplemented') {
    console.warn("The current browser doesn't support offline persistence");
  }
}

// Set auth persistence
export const setAuthPersistence = async (persist = true) => {
  try {
    await setPersistence(
      auth, 
      persist ? browserLocalPersistence : browserSessionPersistence
    );
  } catch (error) {
    console.error("Error setting auth persistence:", error);
  }
};

// Initialize Analytics (only in production and if supported)
let analytics;
if (typeof window !== 'undefined') {
  isSupported().then(yes => {
    if (yes) {
      analytics = getAnalytics(app);
    }
  });
}

export { analytics };
