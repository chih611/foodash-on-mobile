import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Button, FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import 'react-native-get-random-values';
import * as Location from 'expo-location';
import { MaterialIcons } from '@expo/vector-icons';


const DessertShopsMap = () => {
    const [region, setRegion] = useState(null);
    const [shops, setShops] = useState([]);
    const [loading, setLoading] = useState(true);
    const [errorMsg, setErrorMsg] = useState(null);
    const [searchItem, setSearchItem] = useState('');
    const [searchHistory, setSearchHistory] = useState([]);

    // Get user's current location
    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setErrorMsg('Permission to access location was denied');
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

            // Initial search for dessert shops
            fetchNearbyShops(latitude, longitude, 'dessert');
        })();
    }, []);

    const fetchNearbyShops = async (lat, lng, item = '') => {
        try {
            setLoading(true);
            const apiKey = 'AIzaSyBF5NvI9qkvQhE69wNxCwzovOr2ja5Cgtg';
            const radius = 1500; // 1.5km radius
            const type = 'bakery|cafe|restaurant'; // Google Places types

            // Build the keyword based on search item
            const keyword = item ? `${item}` : 'dessert';

            const response = await fetch(
                `https://maps.googleapis.com/maps/api/place/nearbysearch/json?` +
                `location=${lat},${lng}&radius=${radius}&type=${type}` +
                `&keyword=${encodeURIComponent(keyword)}&key=${apiKey}`
            );

            const data = await response.json();
            if (data.results) {
                setShops(data.results);

                // Add to search history if it's a new item search
                if (item && item !== 'dessert' && !searchHistory.includes(item)) {
                    setSearchHistory(prev => [item, ...prev].slice(0, 5));
                }
            }
            setLoading(false);
        } catch (error) {
            console.error(error);
            setErrorMsg('Failed to fetch shops');
            setLoading(false);
        }
    };

    const handleItemSearch = () => {
        if (!searchItem.trim() || !region) return;

        fetchNearbyShops(region.latitude, region.longitude, searchItem.toLowerCase());
        setSearchItem('');
    };

    const handleHistoryItemPress = (item) => {
        fetchNearbyShops(region.latitude, region.longitude, item);
    };

    if (loading && !region) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" />
                <Text>Finding your location...</Text>
            </View>
        );
    }

    if (errorMsg) {
        return (
            <View style={styles.container}>
                <Text style={styles.errorText}>{errorMsg}</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {/* Search Bar */}
            <View style={styles.searchContainer}>
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search for dessert items (cake, ice cream...)"
                    value={searchItem}
                    onChangeText={setSearchItem}
                    onSubmitEditing={handleItemSearch}
                />
                <Pressable
                    style={({ pressed }) => ({
                        opacity: pressed ? 0.5 : 1,
                        flexDirection: 'row',
                        alignItems: 'center',
                        padding: 10,
                        borderRadius: 5,
                    })}

                >
                    <MaterialIcons name="search" size={24} color="#F38B3C" />
                </Pressable>
            </View>

            {/* Search History */}
            {/* {searchHistory.length > 0 && (
                <View style={styles.historyContainer}>
                    <Text style={styles.historyTitle}>Recent Searches:</Text>
                    <FlatList
                        horizontal
                        data={searchHistory}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={({ item }) => (
                            <Button
                                title={item}
                                onPress={() => handleHistoryItemPress(item)}
                                style={styles.historyItem}
                            />
                        )}
                        contentContainerStyle={styles.historyList}
                    />
                </View>
            )} */}

            {/* Map View */}
            {region && (
                <MapView style={styles.map} region={region}>
                    <Marker
                        coordinate={region}
                        title="Your Location"
                        pinColor="blue"
                    />
                    {shops.map((shop, index) => (
                        <Marker
                            key={index}
                            coordinate={{
                                latitude: shop.geometry.location.lat,
                                longitude: shop.geometry.location.lng,
                            }}
                            title={shop.name}
                            description={shop.vicinity}
                        />
                    ))}
                </MapView>
            )}

            {/* Loading indicator for searches */}
            {loading && (
                <View style={styles.overlayLoading}>
                    <ActivityIndicator size="large" />
                    <Text>Searching for shops...</Text>
                </View>
            )}

            {/* Shop List */}
            {shops.length > 0 && (
                <View style={styles.shopListContainer}>
                    <Text style={styles.shopListTitle}>Found {shops.length} shops:</Text>
                    <FlatList
                        horizontal
                        data={shops}
                        keyExtractor={(item) => item.place_id}
                        renderItem={({ item }) => (
                            <View style={styles.shopItem}>
                                <Text style={styles.shopName}>{item.name}</Text>
                                <Text style={styles.shopAddress}>{item.vicinity}</Text>
                                <Text style={styles.shopRating}>Rating: {item.rating || 'N/A'}</Text>
                            </View>
                        )}
                    />
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    map: {
        width: '100%',
        height: '90%',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorText: {
        color: 'red',
        fontSize: 16,
        textAlign: 'center',
        margin: 20,
    },
    searchContainer: {
        position: 'absolute',
        top: 10,
        left: 10,
        right: 10,
        zIndex: 1,
        flexDirection: 'row',
        backgroundColor: 'white',
        borderRadius: 30,
        padding: 5,
        elevation: 3,
    },
    searchInput: {
        flex: 1,
        height: 40,
        paddingHorizontal: 10,
    },
    historyContainer: {
        position: 'absolute',
        top: 60,
        left: 10,
        right: 10,
        zIndex: 1,
        backgroundColor: 'white',
        borderRadius: 5,
        padding: 5,
        elevation: 2,
    },
    historyTitle: {
        fontWeight: 'bold',
        marginBottom: 5,
    },
    historyList: {
        paddingVertical: 5,
    },
    historyItem: {
        marginRight: 10,
    },
    overlayLoading: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: [{ translateX: -50 }, { translateY: -50 }],
        zIndex: 2,
        backgroundColor: 'rgba(255,255,255,0.8)',
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
    },
    shopListContainer: {
        position: 'absolute',
        bottom: 10,
        left: 10,
        right: 10,
        zIndex: 1,
        backgroundColor: 'white',
        borderRadius: 5,
        padding: 10,
        elevation: 3,
        maxHeight: 150,
    },
    shopListTitle: {
        fontWeight: 'bold',
        marginBottom: 5,
    },
    shopItem: {
        width: 200,
        padding: 10,
        marginRight: 10,
        backgroundColor: '#f8f8f8',
        borderRadius: 5,
    },
    shopName: {
        fontWeight: 'bold',
    },
    shopAddress: {
        fontSize: 12,
        color: '#666',
    },
    shopRating: {
        fontSize: 12,
        color: '#ff9500',
    },
});

export default DessertShopsMap;