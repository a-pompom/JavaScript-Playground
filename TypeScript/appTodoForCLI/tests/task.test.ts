import { readFile, readdir, rm } from 'fs/promises';
import { Task, TaskFile } from '../task';
import { clearTmpDir, TMP_DIR_PATH } from './util';

describe('TaskFile', () => {

    // 毎回一時ディレクトリをクリア
    beforeEach(async () => {
        await clearTmpDir();
    });

    test('ファイルが無ければ新規作成されること', async () => {

        // GIVEN
        const tmpFilePath = `${TMP_DIR_PATH}/task.txt`;

        // WHEN
        const sut = new TaskFile(tmpFilePath);
        await sut.writeLine('content');

        // THEN
        const actual = await readFile(tmpFilePath, { encoding: 'utf-8' });
        expect(actual).not.toBeFalsy();
    });

    // ファイルへ追記できるか
    test('ファイルへ追記できること', async () => {

        // GIVEN
        const tmpFilePath = `${TMP_DIR_PATH}/task.txt`;
        const expected = 'hello\nworld\n'

        // WHEN
        const sut = new TaskFile(tmpFilePath);
        await sut.writeLine('hello');
        await sut.writeLine('world');

        // THEN
        const actual = await readFile(tmpFilePath, { encoding: 'utf-8' });
        expect(actual).toBe(expected);
    });
});


describe('Task', () => {

    // 毎回一時ディレクトリをクリア
    beforeEach(async () => {
        await clearTmpDir();
    });

    test('addメソッドでタスクを追加できること', async () => {
        // GIVEN
        const tmpFilePath = `${TMP_DIR_PATH}/task.txt`;
        const expected = 'task\n';

        // WHEN
        const sut = new Task(tmpFilePath);
        sut.add('task');

        // THEN
        const actual = await readFile(tmpFilePath, { encoding: 'utf-8' });
        expect(actual).toBe(expected);
    })
});