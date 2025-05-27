import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import ImageViewer from '../ImageViewer';

// Mock navigation
const mockNavigate = jest.fn();
jest.mock('expo-router', () => ({
    useNavigation: () => ({
        navigate: mockNavigate,
    }),
    useRouter: () => ({}),
}));

describe('ImageViewer', () => {
    const props = {
        imgSource: { uri: 'https://example.com/image.jpg' },
        link: 'DessertsScreen',
        name: 'Desserts',
    };

    it('renders image and label', () => {
        const { getByText } = render(<ImageViewer {...props} />);
        expect(getByText('Desserts')).toBeTruthy();
    });

    it('navigates when pressed', () => {
        const { getByRole } = render(<ImageViewer {...props} />);
        const touchable = getByRole('button');
        fireEvent.press(touchable);
        expect(mockNavigate).toHaveBeenCalledWith('DessertsScreen');
    });
});