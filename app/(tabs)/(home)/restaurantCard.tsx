import { View, Text, Image, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type RestaurantCardProps = {
    name: string;
    rating?: number;
};

const RestaurantCard = ({ name, rating = 4.5 }: RestaurantCardProps) => {
    return (
        <View style={styles.card}>
            {/* Restaurant Image */}
            <Image
                source={{ uri: 'https://source.unsplash.com/random/300x200/?restaurant' }}
                style={styles.image}
            />

            {/* Restaurant Info */}
            <View style={styles.infoContainer}>
                <Text style={styles.name}>{name}</Text>
                <View style={styles.ratingContainer}>
                    <Ionicons name="star" size={16} color="#FFD700" />
                    <Text style={styles.ratingText}>{rating} stars</Text>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        width: 160,
        backgroundColor: 'white',
        borderRadius: 12,
        marginRight: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3, // Android shadow
        marginBottom: 10,
    },
    image: {
        width: '100%',
        height: 120,
        borderTopLeftRadius: 12,
        borderTopRightRadius: 12,
        resizeMode: 'cover',
    },
    infoContainer: {
        padding: 12,
    },
    name: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 4,
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    ratingText: {
        fontSize: 14,
        color: '#666',
        marginLeft: 4,
    },
});

export default RestaurantCard;
// Usage example:
// <RestaurantCard name="Torl" rating={4.5} />
// <RestaurantCard name="Matcha" />