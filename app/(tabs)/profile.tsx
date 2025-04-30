import React, { useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useForm, Controller } from "react-hook-form";
import Button from "@/components/Button";
import {
  getUserProfile,
  updateUserProfile,
  ProfileData,
} from "@/profileService";

export default function ProfileScreen() {
  const { control, handleSubmit, reset } = useForm<ProfileData>();

  useEffect(() => {
    const fetchProfile = async () => {
      const profile = await getUserProfile();
      if (profile) reset(profile);
    };
    fetchProfile();
  }, []);

  const onSubmit = async (data: ProfileData) => {
    try {
      await updateUserProfile(data);
      Alert.alert("Success", "Profile updated successfully");
    } catch (err: any) {
      Alert.alert("Error", err.message || "Failed to update profile");
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.avatarContainer}>
          <View style={styles.avatarCircle}>
            <Ionicons name="person-outline" size={64} color="#f38b3c" />
          </View>
          <TouchableOpacity style={styles.editIcon}>
            <MaterialIcons name="edit" size={20} color="#f38b3c" />
          </TouchableOpacity>
        </View>

        {[
          ["firstName", "First name"],
          ["lastName", "Last name"],
          ["dob", "dd/mm/yyyy"],
          ["gender", "Gender"],
          ["contacts", "Contacts"],
          ["address1", "Address line 1"],
          ["address2", "Address line 2"],
        ].map(([name, placeholder]) => (
          <Controller
            key={name}
            control={control}
            name={name as keyof ProfileData}
            render={({ field: { onChange, value } }) => (
              <TextInput
                style={
                  name === "firstName" ||
                  name === "lastName" ||
                  name === "dob" ||
                  name === "gender"
                    ? styles.input
                    : styles.inputFull
                }
                placeholder={placeholder}
                onChangeText={onChange}
                value={value}
              />
            )}
          />
        ))}

        <TouchableOpacity
          style={styles.saveButton}
          onPress={handleSubmit(onSubmit)}
        >
          <Text style={styles.saveText}>Save profile</Text>
        </TouchableOpacity>

        <Button
          theme="red"
          label="Sign out"
          onPress={() => alert("Signed out")}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  content: { padding: 20, paddingBottom: 100, alignItems: "center" },
  avatarContainer: {
    alignItems: "center",
    marginVertical: 20,
    position: "relative",
  },
  avatarCircle: {
    borderWidth: 2,
    borderColor: "#f38b3c",
    borderRadius: 75,
    width: 120,
    height: 120,
    justifyContent: "center",
    alignItems: "center",
  },
  editIcon: {
    position: "absolute",
    bottom: 10,
    right: 100,
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 4,
    borderWidth: 1,
    borderColor: "#f38b3c",
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#f38b3c",
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 10,
    width: "48%",
  },
  inputFull: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#f38b3c",
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 10,
  },
  saveButton: {
    backgroundColor: "#f38b3c",
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginTop: 10,
    width: "100%",
    alignItems: "center",
  },
  saveText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
});
