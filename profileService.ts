import { auth } from "./firebaseConfig";
import {
  updateProfile,
  updateEmail,
  updatePassword,
  User,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from "firebase/auth";
import { doc, setDoc, getDoc, getFirestore } from "firebase/firestore";

const db = getFirestore();

// Interface for profile data
export interface ProfileData {
  fullName?: string; // Added to match signup form
  firstName?: string;
  lastName?: string;
  dob?: string;
  gender?: string;
  contacts?: string;
  address1?: string;
  address2?: string;
  email?: string;
  photoURL?: string;
}

// Basic profile update function
export const updateUserProfile = async (
  profileData: ProfileData
): Promise<void> => {
  try {
    const user = auth.currentUser;

    if (!user) {
      throw new Error("No authenticated user found");
    }

    // First, update the Auth profile (limited fields)
    const authUpdateData: {
      displayName?: string;
      photoURL?: string;
    } = {};

    // Build full name from first and last name
    if (profileData.firstName || profileData.lastName) {
      const displayName = `${profileData.firstName || ""} ${
        profileData.lastName || ""
      }`.trim();
      if (displayName) authUpdateData.displayName = displayName;
    }

    if (profileData.photoURL) {
      authUpdateData.photoURL = profileData.photoURL;
    }

    // Update auth profile if we have any auth fields to update
    if (Object.keys(authUpdateData).length > 0) {
      await updateProfile(user, authUpdateData);
    }

    // Then, store the complete profile data in Firestore
    const userDocRef = doc(db, "users", user.uid);

    // First check if the document exists
    const userDoc = await getDoc(userDocRef);

    if (userDoc.exists()) {
      // Update existing document
      await setDoc(userDocRef, profileData, { merge: true });
    } else {
      // Create new document
      await setDoc(userDocRef, profileData);
    }

    return Promise.resolve();
  } catch (error) {
    console.error("Error updating profile:", error);
    return Promise.reject(error);
  }
};

// Update email (requires recent authentication)
export const updateUserEmail = async (
  newEmail: string,
  password: string
): Promise<void> => {
  try {
    const user = auth.currentUser;

    if (!user || !user.email) {
      throw new Error("No authenticated user found or user has no email");
    }

    // Re-authenticate the user before changing email
    const credential = EmailAuthProvider.credential(user.email, password);
    await reauthenticateWithCredential(user, credential);

    // Update email
    await updateEmail(user, newEmail);

    return Promise.resolve();
  } catch (error) {
    console.error("Error updating email:", error);
    return Promise.reject(error);
  }
};

// Update password (requires recent authentication)
export const updateUserPassword = async (
  currentPassword: string,
  newPassword: string
): Promise<void> => {
  try {
    const user = auth.currentUser;

    if (!user || !user.email) {
      throw new Error("No authenticated user found or user has no email");
    }

    // Re-authenticate the user before changing password
    const credential = EmailAuthProvider.credential(
      user.email,
      currentPassword
    );
    await reauthenticateWithCredential(user, credential);

    // Update password
    await updatePassword(user, newPassword);

    return Promise.resolve();
  } catch (error) {
    console.error("Error updating password:", error);
    return Promise.reject(error);
  }
};

// Fetch user profile from Firestore
export const getUserProfile = async (): Promise<ProfileData | null> => {
  try {
    const user = auth.currentUser;

    if (!user) {
      throw new Error("No authenticated user found");
    }

    const userDocRef = doc(db, "users", user.uid);
    const userDoc = await getDoc(userDocRef);

    if (userDoc.exists()) {
      return userDoc.data() as ProfileData;
    } else {
      // If no profile exists yet, return basic info from auth
      return {
        firstName: user.displayName?.split(" ")[0] || "",
        lastName: user.displayName?.split(" ").slice(1).join(" ") || "",
        email: user.email || "",
        photoURL: user.photoURL || "",
      };
    }
  } catch (error) {
    console.error("Error fetching profile:", error);
    return null;
  }
};
