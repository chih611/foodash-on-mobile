import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ActivityIndicator, Alert, ScrollView } from 'react-native';
// import { MapView, Marker } from 'expo-maps';
import * as Location from 'expo-location';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import MapView, { Marker } from 'react-native-maps';
import 'react-native-get-random-values';
import { MaterialIcons } from '@expo/vector-icons';
// import { v4 as uuidv4 } from 'uuid';

const GOOGLE_MAPS_API_KEY = 'AIzaSyBF5NvI9qkvQhE69wNxCwzovOr2ja5Cgtg'; // Replace with your API key

const GoogleMap = () => {
    const [location, setLocation] = useState(null);
    const [selectedLocation, setSelectedLocation] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getLocation = async () => {
            try {
                const { status } = await Location.requestForegroundPermissionsAsync();
                if (status !== 'granted') {
                    Alert.alert('Permission Denied', 'Enable location services to use this feature.');
                    return;
                }

                const userLocation = await Location.getCurrentPositionAsync({});
                setLocation({
                    latitude: userLocation.coords.latitude,
                    longitude: userLocation.coords.longitude,
                    latitudeDelta: 0.01,
                    longitudeDelta: 0.01,
                });
            } catch (error) {
                console.error('Error fetching location:', error);
            } finally {
                setLoading(false);
            }
        };

        getLocation();
    }, []);

    return (
        <View style={styles.container}>
            {/* Search Bar for Places */}

            <GooglePlacesAutocomplete
                placeholder="Search a place..."
                query={{
                    key: GOOGLE_MAPS_API_KEY,
                    language: 'en',
                }}
                onPress={(data, details = null) => {
                    // Get selected place details
                    const { lat, lng } = details?.geometry?.location || {};
                    if (lat && lng) {
                        setSelectedLocation({
                            latitude: lat,
                            longitude: lng,
                            latitudeDelta: 0.01,
                            longitudeDelta: 0.01,
                        });
                    }
                }}
                fetchDetails={true}
                styles={{
                    container: { flex: 0, width: '100%', padding: 10 },
                    textInput: { height: 50, fontSize: 16, color: '#F38B3C', borderWidth: 1, borderColor: '#F38B3C', borderRadius: 30, paddingLeft: 20 },
                }}
            />
            {/* Map with Markers */}
            {loading ? (
                <ActivityIndicator size="large" color="blue" />
            ) : (
                <MapView style={styles.map} initialRegion={location} region={selectedLocation || location}>
                    {location && (
                        <Marker
                            coordinate={location}
                            title="Your Location"
                            description="Current location"
                        />
                    )}
                    {selectedLocation && (
                        <Marker
                            coordinate={selectedLocation}
                            title="Selected Place"
                            description="Search Result"
                        />
                    )}
                </MapView>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    map: {
        flex: 1,
    },
});

export default GoogleMap;
