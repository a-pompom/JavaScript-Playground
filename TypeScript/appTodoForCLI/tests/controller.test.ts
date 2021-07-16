import { TodoController } from '../controller';
import {jest} from '@jest/globals';

test('開始メッセージが出力されること', () => {

    // GIVEN
    const consoleMock = jest.fn();
    console.log = consoleMock;
    const expected = TodoController.START_MESSAGE;

    // WHEN
    const sut = new TodoController();
    sut.run();

    // THEN
    const actual = consoleMock.mock.calls[0][0];
    expect(actual).toBe(expected);
});