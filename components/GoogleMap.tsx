import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ActivityIndicator, Alert } from 'react-native';

import * as Location from 'expo-location';
import MapView, { Marker } from 'react-native-maps';

const GoogleMap = () => {
    const [location, setLocation] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getLocation = async () => {
            try {
                // Request location permission
                const { status } = await Location.requestForegroundPermissionsAsync();
                if (status !== 'granted') {
                    Alert.alert('Permission Denied', 'Enable location services to use this feature.');
                    return;
                }

                // Get current location
                const userLocation = await Location.getCurrentPositionAsync({});
                setLocation({
                    latitude: userLocation.coords.latitude,
                    longitude: userLocation.coords.longitude,
                    latitudeDelta: 0.01, // Zoom level
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
            {loading ? (
                <ActivityIndicator size="large" color="blue" />
            ) : (
                <MapView style={styles.map} initialRegion={location}>
                    {location && (
                        <Marker
                            coordinate={location}
                            title="You are here"
                            description="Current Location"
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
