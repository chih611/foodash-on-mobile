import { Text, View, StyleSheet } from 'react-native';

export default function UploadScreen() {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>Upload screen</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        color: '#F38B3C',
    },
});
