import { View, StyleSheet, TouchableWithoutFeedback, Keyboard, Text } from 'react-native';

import Button from '@/components/Button';
import ImageViewer from '@/components/ImageViewer';
import SearchComponent from '@/components/Search';
import Breadcrumb from '@/components/Breadcrumb';
import RestaurantCard from './restaurantCard';

const PlaceholderImage = require('@/assets/images/birthday_cake.jpg');

export default function Index() {
  const handleBreadcrumbPress = (index: number) => {
    console.log(`Breadcrumb ${index} clicked`);
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
            <ImageViewer imgSource={PlaceholderImage} link='matcha' name='Matcha' />
          </View>
        </View>
        <View style={styles.mostPopularPlacesContainer}>
          <Text style={styles.mostPopularPlacesText}>
            Most popular places
          </Text>
          <View style={styles.divider} />
        </View>
        <View style={styles.imageContainer}>
          {/* <View>
            <ImageViewer imgSource={PlaceholderImage} link='desserts' name='Desserts' />
          </View> */}
          <RestaurantCard name='ToriMatcha' />
        </View>
      </View>

    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
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
    // minHeight: '20%',
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
