import { Tabs } from "expo-router";

import Ionicons from "@expo/vector-icons/Ionicons";
import Feather from "@expo/vector-icons/Feather";
import AntDesign from "@expo/vector-icons/AntDesign";
import FontAwesome from "@expo/vector-icons/FontAwesome";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#F38B3C",
        headerStyle: {
          backgroundColor: "#F38B3C",
        },
        headerShadowVisible: false,
        headerTintColor: "#fff",
        tabBarStyle: {
          backgroundColor: "#fff",
        },
      }}
    >
      <Tabs.Screen
        name="(home)"
        options={{
          title: "Home",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "home-sharp" : "home-outline"}
              color={color}
              size={24}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="upload"
        options={{
          title: "Upload",
          tabBarIcon: ({ color, focused }) => (
            <AntDesign name="plussquareo" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="map"
        options={{
          title: "Map",
          tabBarIcon: ({ color, focused }) => (
            <Feather name="map-pin" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, focused }) => (
            <FontAwesome name="user-circle" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="signIn"
        options={{
          title: "Sign In",
          tabBarIcon: ({ color, focused }) => (
            <FontAwesome name="user-circle" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="signUp"
        options={{
          title: "Sign Up",
          tabBarIcon: ({ color, focused }) => (
            <FontAwesome name="user-circle" size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
