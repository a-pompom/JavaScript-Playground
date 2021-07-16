import { main } from './fileHandle';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));


test('ファイル読み込み', async () => {

    const expected = 'Hello Jest';

    const actual = await main();
    expect(actual).toBe(expected);
});
