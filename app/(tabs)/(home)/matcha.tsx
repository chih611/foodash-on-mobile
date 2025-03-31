import Breadcrumb from '@/components/Breadcrumb';
import SearchComponent from '@/components/Search';
import { Text, View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function MatchaScreen() {
    const handleBreadcrumbPress = (index: number) => {
        console.log(`Breadcrumb ${index} clicked`);
    };
    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <SearchComponent />
            </View>
            <View style={styles.breadcrumbContainer}>
                <Breadcrumb
                    breadcrumbs={['Category', 'Matcha']}
                    onPress={handleBreadcrumbPress}
                />
            </View>
            <View style={styles.container}>
                <Text style={styles.text}>Matcha screen</Text>
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