export const Image = {
    require: jest.fn().mockReturnValue('mocked-image'),
};
export const View = 'View';
export const Text = 'Text';
export const Pressable = 'Pressable';
export const StyleSheet = {
    create: jest.fn().mockImplementation((styles) => styles),
};