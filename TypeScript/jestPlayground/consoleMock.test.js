import { jest } from '@jest/globals';
test('mock console.log', () => {
    const consoleMock = jest.fn();
    console.log = consoleMock;
    console.log('Hello');
    console.log('World');
    expect(consoleMock.mock.calls[0][0]).toBe('Hello');
});
//# sourceMappingURL=consoleMock.test.js.map