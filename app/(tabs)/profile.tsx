import React from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";

export default function ProfileScreen() {
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity>
          <Ionicons name="menu" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>StoreName</Text>
        <TouchableOpacity>
          <Ionicons name="person-circle-outline" size={28} color="#fff" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Avatar */}
        <View style={styles.avatarContainer}>
          <View style={styles.avatarCircle}>
            <Ionicons name="person-outline" size={64} color="#f38b3c" />
          </View>
          <TouchableOpacity style={styles.editIcon}>
            <MaterialIcons name="edit" size={20} color="#f38b3c" />
          </TouchableOpacity>
        </View>

        {/* Input Fields */}
        <View style={styles.row}>
          <TextInput style={styles.input} placeholder="First name" />
          <TextInput style={styles.input} placeholder="Last name" />
        </View>
        <View style={styles.row}>
          <TextInput style={styles.input} placeholder="dd/mm/yyyy" />
          <TextInput style={styles.input} placeholder="Gender" />
        </View>
        <TextInput style={styles.inputFull} placeholder="Contacts" />
        <TextInput style={styles.inputFull} placeholder="Address line 1" />
        <TextInput style={styles.inputFull} placeholder="Address line 2" />

        <TouchableOpacity style={styles.saveButton}>
          <Text style={styles.saveText}>Save profile</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Bottom Tab */}
      <View style={styles.tabBar}>
        <TouchableOpacity style={styles.tabItem}>
          <Ionicons name="home-outline" size={20} color="#f38b3c" />
          <Text style={styles.tabLabel}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabItem}>
          <Ionicons name="map-outline" size={20} color="#f38b3c" />
          <Text style={styles.tabLabel}>Map</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabItem}>
          <Ionicons name="cloud-upload-outline" size={20} color="#f38b3c" />
          <Text style={styles.tabLabel}>Upload</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.tabItem, styles.activeTab]}>
          <Ionicons name="person-outline" size={20} color="#fff" />
          <Text style={[styles.tabLabel, { color: "#fff" }]}>Profile</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: {
    flexDirection: "row",
    backgroundColor: "#f38b3c",
    paddingHorizontal: 20,
    paddingVertical: 16,
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerTitle: { color: "#fff", fontSize: 18, fontWeight: "bold" },

  content: {
    padding: 20,
    paddingBottom: 100,
    alignItems: "center",
  },
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
  row: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
    gap: 10,
    marginBottom: 10,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#f38b3c",
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
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
  saveText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },

  tabBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 12,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  tabItem: {
    alignItems: "center",
    padding: 4,
  },
  tabLabel: {
    fontSize: 12,
    color: "#f38b3c",
  },
  activeTab: {
    backgroundColor: "#f38b3c",
    borderRadius: 12,
    paddingHorizontal: 12,
  },
});
