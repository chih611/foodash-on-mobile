// firebaseConfig.ts
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
const firebaseConfig = {
  apiKey: "AIzaSyB9NKFyJfMnI7m5yZuTaEJVwgFp6O8knqY",
  authDomain: "foodash-mobile.firebaseapp.com",
  projectId: "foodash-mobile",
  storageBucket: "foodash-mobile.appspot.com",
  messagingSenderId: "341923236114",
  appId: "1:341923236114:android:2340983b1122dd82468bcb",
};

const app = initializeApp(firebaseConfig);
// const auth = getAuth(app);
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});

export { auth };
