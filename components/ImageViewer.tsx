import { Linking, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Image, ImageBackground, type ImageSource } from 'expo-image';
import { useNavigation } from 'expo-router';

type Props = {
    imgSource: ImageSource;
    link: string;
    name: string;
};

export default function ImageViewer({ imgSource, link, name }: Props) {
    const navigation = useNavigation();

    const handlePress = () => {
        navigation.navigate(link); // Replace with your desired link
    };
    return (
        <TouchableOpacity onPress={handlePress}>
            {/* <Image source={imgSource} style={styles.image} placeholder='Desserts' /> */}
            <ImageBackground
                source={imgSource} // Replace with your image URL
                style={styles.image}
            >
                <View style={styles.overlay}>
                    <Text style={styles.text}>{name}</Text>
                </View>
            </ImageBackground>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    image: {
        width: 200,
        height: 200,
        borderRadius: 18,
    },
    overlay: {
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
        padding: 10,
        borderRadius: 5,
    },
    text: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
});
