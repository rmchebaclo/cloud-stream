
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {
    getAuth, 
    signInWithPopup, 
    GoogleAuthProvider,
    onAuthStateChanged, // help us detect if a user has signed-in or signed-out
    User // provide type checking
} from "firebase/auth"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDIm96bQJW0YWR6h6UOaQOoL0qrimeWqBc",
  authDomain: "yt-clone-a7548.firebaseapp.com",
  projectId: "yt-clone-a7548",
  appId: "1:654097845674:web:6bf57686ef4d0214edafd3",
  measurementId: "G-30TR9C8Q12"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);

// creating wrapper functions because we don't want to expose auth variable to components
/**
 * Signs the user in with a Google popup.
 * @returns A promise that resolves with the user's credentials.
 */
export function signInWithGoogle() {
    return signInWithPopup(auth, new GoogleAuthProvider());
  }
  
  /**
   * Signs the user out.
   * @returns A promise that resolves when the user is signed out.
   */
  export function signOutWithGoogle() {
    return auth.signOut();
  }
  
  /**
   * Trigger a callback when user auth state changes.
   * @returns A function to unsubscribe callback.
   */
  export function onAuthStateChangedHelper(callback: (user: User | null) => void) {
    return onAuthStateChanged(auth, callback);
  }