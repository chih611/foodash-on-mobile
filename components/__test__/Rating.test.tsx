import { render, screen } from '@testing-library/react-native';
import StarRating from '../Rating';


describe('StarRating Component', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('renders correct number of filled stars for rating', () => {
        render(<StarRating rating={3.7} />);
        const halfStar = screen.getByTestId('star-filled');
        expect(halfStar).toBeTruthy();
    });
});