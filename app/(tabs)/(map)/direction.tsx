import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  Platform,
} from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";
import * as Location from "expo-location";
import { getRoute } from "@/services/getRoute";

const DirectionMap = () => {
  interface Region {
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
  }

  const [region, setRegion] = useState<Region | null>(null);
  interface Shop {
    place_id: string;
    name: string;
    vicinity: string;
    rating?: number;
    geometry: {
      location: {
        lat: number;
        lng: number;
      };
    };
  }

  const [shopsData, setShopsData] = useState<Shop[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [searchItem, setSearchItem] = useState("");
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const { shop, category } = useLocalSearchParams<{
    shop: string;
    category: string;
  }>();
  const [routeCoords, setRouteCoords] = useState<LatLng[]>([]);

  const data = JSON.parse(shop);

  let MapView;
  if (Platform.OS === "web") {
    MapView = ({
      children,
      style,
      initialRegion,
    }: {
      children: React.ReactNode;
      style: any;
      initialRegion: any;
    }) => (
      <View style={[style, { backgroundColor: "#f0f0f0" }]}>
        <Text style={{ padding: 20 }}>
          Map View (Web Preview - Lat: {initialRegion?.latitude}, Lng:{" "}
          {initialRegion?.longitude})
        </Text>
        {children}
      </View>
    );
  } else {
    const RNMaps = require("react-native-maps");
    MapView = RNMaps.default;
  }

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        setLoading(false);
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;
      setRegion({
        latitude,
        longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });

      getRoute(
        { latitude: latitude, longitude: longitude },
        {
          latitude: data.geometry.location.lat,
          longitude: data.geometry.location.lng,
        }
      ).then((route) => {
        if (route) {
          const points = route.overview_polyline.points;
          const coords = decodePolyline(points).map((point) => ({
            latitude: point[0],
            longitude: point[1],
          }));
          setRouteCoords(coords);
        } else {
          setErrorMsg("Failed to fetch route");
        }
      });
    })();
  }, []);

  const decodePolyline = (encoded: string): number[][] => {
    let points = [];
    let index = 0;
    let lat = 0;
    let lng = 0;

    while (index < encoded.length) {
      let shift = 0;
      let result = 0;
      let byte;

      do {
        byte = encoded.charCodeAt(index++) - 63;
        result |= (byte & 0x1f) << shift;
        shift += 5;
      } while (byte >= 0x20);

      let deltaLat = result & 1 ? ~(result >> 1) : result >> 1;
      lat += deltaLat;

      shift = 0;
      result = 0;

      do {
        byte = encoded.charCodeAt(index++) - 63;
        result |= (byte & 0x1f) << shift;
        shift += 5;
      } while (byte >= 0x20);

      let deltaLng = result & 1 ? ~(result >> 1) : result >> 1;
      lng += deltaLng;

      points.push([lat * 1e-5, lng * 1e-5]);
    }

    return points;
  };

  if (errorMsg) {
    return <Text>{errorMsg}</Text>;
  }

  if (!data || !region) {
    return <Text>Loading...</Text>;
  }

  return (
    <View style={styles.container}>
      <MapView style={styles.map} region={region}>
        {region && (
          <Marker
            coordinate={region}
            pinColor="blue"
            title="Current Location"
          />
        )}
        {data?.geometry?.location && (
          <Marker
            pinColor="red"
            coordinate={{
              latitude: data.geometry.location.lat,
              longitude: data.geometry.location.lng,
            }}
            title={data.vicinity}
            description={data.vicinity}
          />
        )}
        <Polyline
          coordinates={routeCoords}
          strokeColor="#0000FF"
          strokeWidth={3}
        />
      </MapView>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => {
          router.back();
        }}
      >
        <Text style={styles.backButtonText}>Back to List</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
  backButton: {
    padding: 10,
    backgroundColor: "#ff9800",
    alignItems: "center",
    margin: 10,
    borderRadius: 5,
  },
  backButtonText: { color: "#fff", fontSize: 16 },
});

interface LatLng {
  latitude: number;
  longitude: number;
}

export default DirectionMap;
