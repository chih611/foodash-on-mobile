// firebaseConfig.ts
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyB9NKFyJfMnI7m5yZuTaEJVwgFp6O8knqY",
  authDomain: "foodash-mobile.firebaseapp.com",
  projectId: "foodash-mobile",
  storageBucket: "foodash-mobile.appspot.com",
  messagingSenderId: "341923236114",
  appId: "1:341923236114:android:2340983b1122dd82468bcb",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };
