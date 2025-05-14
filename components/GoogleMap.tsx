import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Button, FlatList, Image, Platform, Pressable, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import 'react-native-get-random-values';
import * as Location from 'expo-location';
import { MaterialIcons } from '@expo/vector-icons';
import StarRating from './Rating';
import { router } from 'expo-router';


const DessertShopsMap = () => {
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

    const [shops, setShops] = useState<Shop[]>([]);
    const [loading, setLoading] = useState(true);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [searchItem, setSearchItem] = useState('');
    const [searchHistory, setSearchHistory] = useState<string[]>([]);
    let MapView;
    if (Platform.OS === 'web') {
        // Web implementation (simplified)
        MapView = ({ children, style, initialRegion }: { children: React.ReactNode; style: any; initialRegion: any }) => (
            <View style={[style, { backgroundColor: '#f0f0f0' }]}>
                <Text style={{ padding: 20 }}>
                    Map View (Web Preview - Lat: {initialRegion?.latitude}, Lng: {initialRegion?.longitude})
                </Text>
                {children}
            </View>
        );

        // Marker = ({ children }) => children;
    } else {
        // Native implementation
        const RNMaps = require('react-native-maps');
        MapView = RNMaps.default;
        // Marker = RNMaps.Marker;
    }
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

    const fetchNearbyShops = async (lat: number, lng: number, item: string = '') => {
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

    const handleHistoryItemPress = (item: string) => {
        if (region) {
            fetchNearbyShops(region.latitude, region.longitude, item);
        }
    };
    const handleShopPress = (shop: Shop) => {
        // console.log('Shop pressed:', shop);
        router.push({
            pathname: '/(tabs)/(map)/direction',
            params: { shop: JSON.stringify(shop) },
        });
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
                    onPress={handleItemSearch}

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
                            <TouchableOpacity onPress={() => handleShopPress(item)}>
                                <View style={styles.shopItem}>
                                    <View>
                                        <Image
                                            source={{ uri: `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${item.photos ? item.photos[0].photo_reference : ''}&key=AIzaSyBF5NvI9qkvQhE69wNxCwzovOr2ja5Cgtg` }}
                                            onError={(e) => console.log('Image load error:', e.nativeEvent.error)}
                                            style={{ width: 60, height: 60, borderRadius: 15, marginRight: 10 }}
                                        />
                                    </View>
                                    <View>
                                        <Text style={styles.shopName}>{item.name}</Text>
                                        <Text style={styles.shopAddress}>{item.vicinity}</Text>
                                        <StarRating rating={item.rating || 0} />
                                    </View>
                                </View>
                            </TouchableOpacity>
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
        height: '100%',
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
        flex: 1,
        flexDirection: 'row',
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