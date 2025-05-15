import GoogleMap from "@/components/GoogleMap";
import { View, StyleSheet } from "react-native";

export default function MapScreen() {
  return <View style={styles.container}>
    <GoogleMap />
  </View>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
  },
  text: {
    color: "#F38B3C",
  },
});
