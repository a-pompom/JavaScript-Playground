import path from 'path';
import { fileURLToPath } from 'url';
import {readdir, rm} from 'fs/promises';

/**
 * カレントディレクトリ名を取得
 *
 */
export const get__dirname = (): string => {

    const __dirname = path.dirname(fileURLToPath(import.meta.url));
    return __dirname;
};

export const TMP_DIR_PATH = `${get__dirname()}/tmpdir`;

/**
 * テスト用の一時ディレクトリを初期化
 */
export const clearTmpDir = async () => {

    const files = await readdir(TMP_DIR_PATH);

    for (const file of files) {
        const rmPath = `${TMP_DIR_PATH}/${file}`;
        await rm(rmPath);
    }
}
