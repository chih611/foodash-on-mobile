import Breadcrumb from '@/components/Breadcrumb';
import SearchComponent from '@/components/Search';
import { useEffect, useState } from 'react';
import { Text, View, StyleSheet, Platform, ActivityIndicator, FlatList, Image, TouchableOpacity } from 'react-native';
import * as Location from 'expo-location';
import { router, useLocalSearchParams } from 'expo-router';
import { ImageBackground } from 'expo-image';
import StarRating from '@/components/Rating';

export default function DessertsScreen() {
    const { categoryName, link, data } = useLocalSearchParams<{
        categoryName: string;
        link: string;
        data: string[];
    }>();
    // console.log('test:', JSON.stringify(data));
    const handleBreadcrumbPress = (index: number) => {
        console.log(`Breadcrumb ${index} clicked`);
    };
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
        photos?: {
            photo_reference: string;
            width: number;
            height: number;
        }[];
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
            fetchNearbyShops(latitude, longitude, 'desserts');
        })();
    }, []);

    const fetchNearbyShops = async (lat: number, lng: number, item: string = '') => {
        try {
            setLoading(true);
            const apiKey = 'AIzaSyBF5NvI9qkvQhE69wNxCwzovOr2ja5Cgtg';
            const radius = 1500; // 1.5km radius
            const type = 'hotpot'; // Google Places types

            // Build the keyword based on search item
            const keyword = item ? `${item}` : '';

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
    // const getPlacePhotoUrl = async (photoReference: string): Promise<string> => {
    //     try {
    //         const url = `https://maps.googleapis.com/maps/api/place/photo`;
    //         const params = {
    //             maxwidth: 400,
    //             photoreference: photoReference,
    //             key: "AIzaSyBF5NvI9qkvQhE69wNxCwzovOr2ja5Cgtg",
    //         };

    //         const response = await axios.get(url, { params, responseType: 'text' });
    //         // The response will redirect to the image URL
    //         return response.request.responseURL || ''; // Use the redirected URL
    //     } catch (error) {
    //         console.error('Error fetching photo:', error);
    //         return '';
    //     }
    // };


    if (loading && !region) {
        return (
            <View>
                <ActivityIndicator size="large" />
                <Text>Finding your location...</Text>
            </View>
        );
    }

    if (errorMsg) {
        return (
            <View style={styles.container}>
                <Text>{errorMsg}</Text>
            </View>
        );
    }
    const handleShopPress = (shop: Shop) => {
        // console.log('Shop pressed:', shop);
        router.push({
            pathname: '/(tabs)/(map)/direction',
            params: { shop: JSON.stringify(shop) },
        });
    };
    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <SearchComponent />
            </View>
            <View style={styles.breadcrumbContainer}>
                <Breadcrumb
                    breadcrumbs={['Category', 'Desserts']}
                    onPress={handleBreadcrumbPress}
                />
            </View>
            <View style={styles.listItems}>
                {shops.length > 0 && (
                    <View >
                        <Text>Found {shops.length} shops:</Text>
                        <FlatList
                            data={shops}
                            keyExtractor={(item) => item.place_id}
                            renderItem={({ item }) => (
                                <TouchableOpacity onPress={() => handleShopPress(item)}>
                                    <View style={styles.item}>
                                        <Image
                                            source={{ uri: `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${item.photos ? item.photos[0].photo_reference : ''}&key=AIzaSyBF5NvI9qkvQhE69wNxCwzovOr2ja5Cgtg` }}
                                            onError={(e) => console.log('Image load error:', e.nativeEvent.error)}
                                            style={{ width: '100%', height: 200, borderRadius: 10 }}
                                        />
                                        <Text>{item.name}</Text>
                                        <Text>{item.vicinity}</Text>
                                        <StarRating rating={item.rating || 0} />
                                    </View>
                                </TouchableOpacity>
                            )}
                        />
                    </View>
                )}
            </View>

        </View>

    );
}

const styles = StyleSheet.create({
    item: {
        width: '100%',
        marginVertical: 10,
    },
    listItems: {
        flex: 1,
        width: '100%',
        paddingHorizontal: 20,
        paddingVertical: 10,
        flexDirection: 'column',
    },
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        alignItems: 'center',

    },
    text: {
        color: '#F38B3C',
    },
    headerContainer: {
        flex: 1 / 6,
        width: '100%',
    },
    breadcrumbContainer: {
        flex: 1 / 8,
        width: '100%',
        paddingHorizontal: 20,

    },
});