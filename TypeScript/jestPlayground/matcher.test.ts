import { sut } from './matcher';

test('matcherのテスト-object', () => {

    const expected = {
        name: 'pom',
        age: 20,
        isLoggedIn: false
    };
    expect(sut.user).toEqual(expected);
});
test('matcherのテスト-array', () => {

    const expectedItem = 1;
    expect(sut.magicNumbers).toContain(expectedItem);
});