import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  User,
} from "firebase/auth";
import { doc, setDoc, getFirestore } from "firebase/firestore";
import { auth } from "./firebaseConfig";
import { ProfileData } from "./profileService";
const db = getFirestore();

// User registration with profile creation
export const registerUser = async (
  email: string,
  password: string,
  fullName: string
): Promise<User> => {
  try {
    // Create the user account
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

    // Update the user's display name
    await updateProfile(user, {
      displayName: fullName,
    });

    // Create initial profile document in Firestore
    const userDocRef = doc(db, "users", user.uid);
    await setDoc(userDocRef, {
      fullName,
      email,
      createdAt: new Date().toISOString(),
    });

    return user;
  } catch (error) {
    console.error("Error registering user:", error);
    throw error;
  }
};

// User sign-in
export const signInUser = async (
  email: string,
  password: string
): Promise<User> => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    return userCredential.user;
  } catch (error) {
    console.error("Error signing in:", error);
    throw error;
  }
};

// User sign-out
export const signOutUser = async (): Promise<void> => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Error signing out:", error);
    throw error;
  }
};

// Password reset
export const resetPassword = async (email: string): Promise<void> => {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error) {
    console.error("Error resetting password:", error);
    throw error;
  }
};

// Get current user
export const getCurrentUser = (): User | null => {
  return auth.currentUser;
};
