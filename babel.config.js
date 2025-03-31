module.exports = function (api) {
    api.cache(true);
    return {
        presets: ['babel-preset-expo'],
        plugins: ['react-native-reanimated/plugin'],
        resolver: {
            extraNodeModules: {
                uuid: require.resolve('react-native-uuid'),
            },
        },
    };
};
