import { View, StyleSheet, TouchableWithoutFeedback, Keyboard, Text, FlatList, TouchableOpacity, Image } from 'react-native';

import Button from '@/components/Button';
import ImageViewer from '@/components/ImageViewer';
import SearchComponent from '@/components/Search';
import Breadcrumb from '@/components/Breadcrumb';
import RestaurantCard from './restaurantCard';
import { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { Place } from 'react-native-google-places-autocomplete';
import * as Location from 'expo-location';
import { getDessertPlaces } from '@/services/getPopularPlaces';
import { getPlacePhotoUrl } from '@/services/getPhoto';
import StarRating from '@/components/Rating';

const PlaceholderImage = require('@/assets/images/birthday_cake.jpg');
const MatchaImage = require('@/assets/images/matcha.jpg');

export default function Index() {
  const [loading, setLoading] = useState(true);
  const [places, setPlaces] = useState<string[]>([]);
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const router = useRouter();
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

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setLoading(false);
        return;
      }

      let currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation);

      const dessertPlaces = await getDessertPlaces(
        currentLocation.coords.latitude,
        currentLocation.coords.longitude
      );
      if (dessertPlaces) {
        const updatedPlaces = await Promise.all(
          dessertPlaces.map(async (place) => {
            const photoReference = place.photos?.[0]?.photo_reference;
            // const photoUrl = photoReference ? await getPlacePhotoUrl(photoReference) : '';
            return { ...place };
          })
        );
        setPlaces(updatedPlaces);
      }
      setLoading(false);
    })();
  }, []);

  const handleBreadcrumbPress = (index: number) => {
    console.log(`Breadcrumb ${index} clicked`);
    console.log('Location:', places);
  };
  const handleShopPress = (shop: Shop) => {
    // console.log('Shop pressed:', shop);
    router.push({
      pathname: '/(tabs)/(map)/direction',
      params: { shop: JSON.stringify(shop) },
    });
  };
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={styles.container}>
        <View style={styles.searchContainer}>
          <SearchComponent />
        </View>
        <View style={styles.breadcrumbContainer}>
          <Breadcrumb
            breadcrumbs={['Categories']}
            onPress={handleBreadcrumbPress}
          />
          <View style={styles.divider} />
        </View>
        <View style={styles.imageContainer}>
          <View>
            <ImageViewer imgSource={PlaceholderImage} link='desserts' name='Desserts' />
          </View>
          <View>
            <ImageViewer imgSource={MatchaImage} link='matcha' name='Matcha' />
          </View>
        </View>
        <View style={styles.mostPopularPlacesContainer}>
          <Text style={styles.mostPopularPlacesText}>
            Most popular places
          </Text>
          <View style={styles.divider} />
        </View>
        <View style={styles.imageContainer}>
          {
            <FlatList
              horizontal
              // key={index}
              data={places}
              renderItem={({ item }) => (
                <TouchableOpacity onPress={() => handleShopPress(item)}>
                  <View style={styles.item}>
                    <Image
                      source={{ uri: `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${item.photos ? item.photos[0].photo_reference : ''}&key=AIzaSyBF5NvI9qkvQhE69wNxCwzovOr2ja5Cgtg` }}
                      onError={(e) => console.log('Image load error:', e.nativeEvent.error)}
                      style={{ width: '100%', height: '60%', borderRadius: 10 }}
                    />
                    <Text>{item.name}</Text>
                    <Text>{item.vicinity}</Text>
                    <StarRating rating={item.rating || 0} />
                  </View>
                </TouchableOpacity>
              )}
            // keyExtractor={(item) => item.place_id} 
            />
          }
        </View>
      </View>

    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  item: {
    marginHorizontal: 10,
    // marginVertical: 10,
  },
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  breadcrumbContainer: {
    flex: 2 / 12,
    width: '100%',
  },
  searchContainer: {
    flex: 2 / 12,
    width: '100%',
    fontFamily: 'sans-serif',
  },
  imageContainer: {
    flex: 4 / 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',

  },
  divider: {
    height: 2,
    backgroundColor: '#F38B3C', // Light gray color
    width: '100%',
    marginTop: 16, // Space above and below the line
  },
  mostPopularPlacesContainer: {
    flex: 2 / 12,
    width: '100%',
    fontFamily: 'sans-serif',
    fontSize: 30,
    fontWeight: 'bold',
  },
  mostPopularPlacesText: {
    fontSize: 30,
  }
});
