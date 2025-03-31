import { Link } from 'expo-router';
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

type BreadcrumbProps = {
    breadcrumbs: string[];
    onPress: (index: number) => void;
};

const Breadcrumb: React.FC<BreadcrumbProps> = ({ breadcrumbs, onPress }) => {
    return (
        <View style={styles.container}>
            {breadcrumbs.map((breadcrumb, index) => (
                <View key={index} style={styles.breadcrumb}>
                    {
                        0 === index ? (<Link style={styles.text} href="/">{breadcrumb}</Link>) :
                            <TouchableOpacity onPress={() => onPress(index)}>
                                <Link style={styles.text} href="/desserts">{breadcrumb}</Link>
                            </TouchableOpacity>
                    }

                    {index < breadcrumbs.length - 1 && (
                        <Text style={styles.separator}> {'>'} </Text>
                    )}
                </View>
            ))
            }
        </View >
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        margin: 10,
    },
    breadcrumb: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    text: {
        fontSize: 20,
        color: '#000',
        fontWeight: 'bold',
    },
    separator: {
        fontSize: 16,
        color: '#000',
        fontWeight: 'bold',
    },
});

export default Breadcrumb;
