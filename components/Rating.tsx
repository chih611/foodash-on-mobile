import React from 'react';
import { View, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

type Props = {
    rating: number;
    maxStars?: number;
    starSize?: number;
};

export default function StarRating({
    rating,
    maxStars = 5,
    starSize = 16,
}: Props) {
    const filledStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = maxStars - Math.ceil(rating);

    return (
        <View style={styles.starContainer}>
            {/* Filled stars */}
            {Array(filledStars)
                .fill(0)
                .map((_, index) => (
                    <Icon
                        key={`filled-${index}`}
                        name="star"
                        size={starSize}
                        color="#FFD700"
                    />
                ))}
            {/* Half star */}
            {hasHalfStar && (
                <Icon key="half" name="star-half" size={starSize} color="#FFD700" />
            )}
            {/* Empty stars */}
            {Array(emptyStars)
                .fill(0)
                .map((_, index) => (
                    <Icon
                        key={`empty-${index}`}
                        name="star-outline"
                        size={starSize}
                        color="#FFD700"
                    />
                ))}
        </View>
    );
}

const styles = StyleSheet.create({
    starContainer: {
        flexDirection: 'row',
    },
});