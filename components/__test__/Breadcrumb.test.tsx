import { render, fireEvent, screen } from '@testing-library/react-native';
import Breadcrumb from '../Breadcrumb';

describe('Breadcrumb Component', () => {
    const mockOnPress = jest.fn();
    const breadcrumbs = ['Home', 'Category', 'Details'];

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('renders all breadcrumbs correctly', () => {
        render(<Breadcrumb breadcrumbs={breadcrumbs} onPress={mockOnPress} />);
        expect(screen.getByText('Home')).toBeTruthy();
        expect(screen.getByText('Category')).toBeTruthy();
        expect(screen.getByText('Details')).toBeTruthy();
    });

});