import { render, screen } from '@testing-library/react-native';
import StarRating from '../Rating';
import { act } from 'react';

describe('StarRating Component', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('renders correct number of filled, half, and empty stars for a decimal rating', () => {
        // act(() => {
        //     render(<StarRating rating={3.5} />);
        // });
        render(<StarRating rating={3.5} maxStars={5} starSize={16} />);
        const filledStars = screen.getAllByTestId('star-filled');
        const halfStar = screen.getByTestId('star-half');
        const emptyStars = screen.getAllByTestId('star-empty');

        expect(filledStars).toHaveLength(3);
        expect(halfStar).toBeTruthy();
        expect(emptyStars).toHaveLength(1);
    });
});