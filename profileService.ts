import {
  updateProfile,
  updateEmail,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { auth, db } from "./firebaseConfig";

export interface ProfileData {
  fullName?: string;
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

export const updateUserProfile = async (
  profileData: ProfileData
): Promise<void> => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error("No authenticated user found");

    const authUpdateData: {
      displayName?: string;
      photoURL?: string;
    } = {};

    if (profileData.firstName || profileData.lastName) {
      const displayName = `${profileData.firstName || ""} ${
        profileData.lastName || ""
      }`.trim();
      if (displayName) authUpdateData.displayName = displayName;
    }

    if (profileData.photoURL) {
      authUpdateData.photoURL = profileData.photoURL;
    }

    if (Object.keys(authUpdateData).length > 0) {
      await updateProfile(user, authUpdateData);
    }

    const userDocRef = doc(db, "users", user.uid);
    const userDoc = await getDoc(userDocRef);

    if (userDoc.exists()) {
      await setDoc(userDocRef, profileData, { merge: true });
    } else {
      await setDoc(userDocRef, profileData);
    }
  } catch (error) {
    console.error("Error updating profile:", error);
    return Promise.reject(error);
  }
};

export const updateUserEmail = async (
  newEmail: string,
  password: string
): Promise<void> => {
  try {
    const user = auth.currentUser;
    if (!user || !user.email) throw new Error("No authenticated user or email");

    const credential = EmailAuthProvider.credential(user.email, password);
    await reauthenticateWithCredential(user, credential);
    await updateEmail(user, newEmail);
  } catch (error) {
    console.error("Error updating email:", error);
    return Promise.reject(error);
  }
};

export const updateUserPassword = async (
  currentPassword: string,
  newPassword: string
): Promise<void> => {
  try {
    const user = auth.currentUser;
    if (!user || !user.email) throw new Error("No authenticated user or email");

    const credential = EmailAuthProvider.credential(
      user.email,
      currentPassword
    );
    await reauthenticateWithCredential(user, credential);
    await updatePassword(user, newPassword);
  } catch (error) {
    console.error("Error updating password:", error);
    return Promise.reject(error);
  }
};

export const getUserProfile = async (): Promise<ProfileData | null> => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error("No authenticated user found");

    const userDocRef = doc(db, "users", user.uid);
    const userDoc = await getDoc(userDocRef);

    if (userDoc.exists()) {
      return userDoc.data() as ProfileData;
    } else {
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
