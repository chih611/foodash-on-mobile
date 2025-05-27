import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import SearchComponent from '../Search';

describe('SearchComponent', () => {
    it('renders the search input', () => {
        const { getByPlaceholderText } = render(<SearchComponent />);
        expect(getByPlaceholderText('Have something in mind?')).toBeTruthy();
    });

    it('filters data based on input', () => {
        const { getByPlaceholderText, queryByDisplayValue } = render(<SearchComponent />);
        const input = getByPlaceholderText('Have something in mind?');

        fireEvent.changeText(input, 'app');
        expect(queryByDisplayValue('app')).toBeTruthy();
        // You can expand this test to check for filtered results if you render them in the component
    });
});