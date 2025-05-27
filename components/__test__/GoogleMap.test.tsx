import React from 'react';
import { render, screen, waitFor } from '@testing-library/react-native';
import DessertShopsMap from '../GoogleMap';

// Mock dependencies
jest.mock('expo-location', () => ({
    requestForegroundPermissionsAsync: jest.fn(() => Promise.resolve({ status: 'granted' })),
    getCurrentPositionAsync: jest.fn(() =>
        Promise.resolve({ coords: { latitude: 1, longitude: 2 } })
    ),
}));

jest.mock('react-native-maps', () => {
    const React = require('react');
    const { View } = require('react-native');
    const MockMap = (props: any) => <View>{props.children}</View>;
    const MockMarker = (props: any) => <View>{props.children}</View>;
    return {
        __esModule: true,
        default: MockMap,
        Marker: MockMarker,
    };
});

describe('DessertShopsMap', () => {
    it('shows loading indicator initially', () => {
        render(<DessertShopsMap />);
        expect(screen.getByText(/Finding your location/i)).toBeTruthy();
    });

    it('shows error message if location permission denied', async () => {
        // Override mock to simulate denied permission
        const expoLocation = require('expo-location');
        expoLocation.requestForegroundPermissionsAsync.mockImplementationOnce(() =>
            Promise.resolve({ status: 'denied' })
        );
        render(<DessertShopsMap />);
        await waitFor(() =>
            expect(screen.getByText(/Permission to access location was denied/i)).toBeTruthy()
        );
    });

    // You can add more tests for successful data fetch, shop list rendering, etc.
});