import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
import { getFirestore } from "firebase/firestore";
import { getStorage, ref } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyB9NKFyJfMnI7m5yZuTaEJVwgFp6O8knqY",
  authDomain: "foodash-mobile.firebaseapp.com",
  projectId: "foodash-mobile",
  storageBucket: "foodash-mobile.firebasestorage.app",
  messagingSenderId: "341923236114",
  appId: "1:341923236114:android:2340983b1122dd82468bcb",
};

const app = initializeApp(firebaseConfig);
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});

const db = getFirestore(app);
const storage = getStorage(app);
const storageRef = ref(storage);
const imagesRef = ref(storageRef, "images/");
const videosRef = ref(storageRef, "videos/");

export { auth, db, storage, imagesRef, videosRef };
