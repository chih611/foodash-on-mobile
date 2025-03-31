import { View, StyleSheet, SafeAreaView } from 'react-native';

import Button from '@/components/Button';
import ImageViewer from '@/components/ImageViewer';
import SearchComponent from '@/components/Search';
import Breadcrumb from '@/components/Breadcrumb';
import { Link } from 'expo-router';



const PlaceholderImage = require('@/assets/images/birthday_cake.jpg');

export default function Index() {
  const handleBreadcrumbPress = (index: number) => {
    console.log(`Breadcrumb ${index} clicked`);
  };
  // const { product } = { product: { id: "1", name: "iPhone 15" } };
  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <SearchComponent />
      </View>
      <View style={styles.breadcrumbContainer}>
        <Breadcrumb
          breadcrumbs={['Category']}
          onPress={handleBreadcrumbPress}
        />
      </View>
      <View style={styles.imageContainer}>
        <ImageViewer imgSource={PlaceholderImage} link='desserts' name='Desserts' />
      </View>
      <View style={styles.imageContainer}>
        <ImageViewer imgSource={PlaceholderImage} link='matcha' name='Matcha' />
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
  },
  breadcrumbContainer: {
    flex: 1 / 4,
    width: '100%',
    paddingHorizontal: 30,

  },
  headerContainer: {
    flex: 1 / 2,
    width: '100%',
  },
  imageContainer: {
    flex: 1,
  },
  footerContainer: {
    flex: 1 / 3,
    alignItems: 'center',
  },
});
