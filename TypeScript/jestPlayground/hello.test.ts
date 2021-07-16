import { sayHello } from './hello';

test('Hello World', () => {

    const actual = sayHello();
    expect(actual).toBe('Hello Jest');
});
