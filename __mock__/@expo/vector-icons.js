export default jest.fn().mockImplementation(() => ({
    toJSON: () => ({ type: 'ICON', name: 'mocked-icon' }),
}));