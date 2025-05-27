import React, { useState } from "react";
import { View, TextInput, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

const data = [
    { id: "1", name: "Apple" },
    { id: "2", name: "Banana" },
    { id: "3", name: "Cherry" },
    { id: "4", name: "Grapes" },
    { id: "5", name: "Mango" },
];

const SearchComponent = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [filteredData, setFilteredData] = useState(data);

    const handleSearch = (query: string) => {
        setSearchQuery(query);
        if (query.trim() === "") {
            setFilteredData(data);
        } else {
            setFilteredData(
                data.filter((item) =>
                    item.name.toLowerCase().includes(query.toLowerCase())
                )
            );
        }
    };

    return (
        <View>
            {/* Search Input */}
            <View style={styles.searchContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Have something in mind?"
                    placeholderTextColor="grey"
                    value={searchQuery}
                    onChangeText={handleSearch}
                />
                <MaterialIcons name="search" size={24} color="#F38B3C" />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingVertical: 20,
        backgroundColor: "#fff",
    },
    searchContainer: {
        color: "#F38B3C",
        flexDirection: "row",
        alignItems: "center",
        borderRadius: 30,
        paddingHorizontal: 10,
        paddingVertical: 8,
        marginBottom: 10,
        borderColor: "#F38B3C",
        borderWidth: 1,
    },
    input: {
        flex: 1,
        marginLeft: 8,
        fontSize: 16,
    },
    resultItem: {
        fontSize: 18,
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: "#ccc",
    },
});

export default SearchComponent;
