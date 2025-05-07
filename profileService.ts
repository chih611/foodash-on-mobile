import {
  updateProfile,
  updateEmail,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  uploadString,
} from "firebase/storage";
import * as ImagePicker from "expo-image-picker";
import * as ImageManipulator from "expo-image-manipulator";
import { auth, db, storage } from "@/firebaseConfig";

// Types
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

// Upload Profile Image and Update Firestore + Auth
export const pickAndUploadProfileImage =
  async (): Promise<ProfileData | null> => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.5,
      });

      if (!result.canceled) {
        const manipulatedImage = await ImageManipulator.manipulateAsync(
          result.assets[0].uri,
          [],
          { compress: 0.5, format: ImageManipulator.SaveFormat.JPEG }
        );

        const response = await fetch(manipulatedImage.uri);
        const blob = await response.blob();

        const uid = auth.currentUser?.uid;
        console.log("Auth UID:", uid);
        console.log("Is Authenticated:", !!uid);

        if (!uid) throw new Error("User not authenticated");

        const imageRef = ref(storage, `avatars/${uid}.jpg`);
        await uploadBytes(imageRef, blob);
        const downloadURL = await getDownloadURL(imageRef);
        console.log("Image uploaded. URL:", downloadURL);

        await updateUserProfile({ photoURL: downloadURL });
        return await getUserProfile();
      }

      return null;
    } catch (error: any) {
      console.error("Full upload error:", JSON.stringify(error));
      throw error;
    }
  };

// Test function: upload a string file
export const testUploadStringFile = async () => {
  try {
    const uid = auth.currentUser?.uid;
    if (!uid) throw new Error("User not authenticated");

    const fileRef = ref(storage, `avatars/${uid}-test.txt`);
    await uploadString(fileRef, "Upload test content from client");
    console.log("Test upload successful");
  } catch (err) {
    console.error("Test upload failed:", err);
  }
};

// Update Firestore and Firebase Auth Profile
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
    await setDoc(userDocRef, profileData, { merge: true });
  } catch (error) {
    console.error("Error updating profile:", error);
    throw error;
  }
};

// Fetch user profile
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

// Email update
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
    throw error;
  }
};

// Password update
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
    throw error;
  }
};

export const signOutUser = async (): Promise<void> => {
  try {
    await auth.signOut();
  } catch (error) {
    console.error("Error signing out:", error);
    throw error;
  }
};
