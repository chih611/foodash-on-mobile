import { render, fireEvent, screen } from '@testing-library/react-native';
import Button from '../Button';

describe('Button Component', () => {
    const mockOnPress = jest.fn();
    const label = 'Test Button';

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('renders default theme correctly', () => {
        render(<Button label={label} />);
        const button = screen.getByText(label);
        expect(button).toBeTruthy();
    });

});