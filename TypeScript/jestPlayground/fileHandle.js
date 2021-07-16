import { readFile } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const main = async () => {
    const result = await readFile(`${__dirname}/sample.txt`, { encoding: 'utf-8' });
    console.log(result);
    return result;
};
//# sourceMappingURL=fileHandle.js.map