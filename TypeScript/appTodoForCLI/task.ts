import { writeFile } from 'fs/promises';

/**
 * タスクのCRUDを責務に持つ
 */
export class Task {

    private fileHandler: TaskFile;

    constructor(filePath: string) {
        this.fileHandler = new TaskFile(filePath);
    }

    /**
     * タスクを追加
     *
     * @param content 追加タスク
     */
    public add = (content: string) => {

        this.fileHandler.writeLine(content);
    }
}

/**
 * タスクのファイル操作を責務に持つ
 */
export class TaskFile {

    private readonly filePath: string;

    constructor(filePath: string) {
        this.filePath = filePath;
    }

    /**
     * 対象ファイルへタスクを書き込む
     *
     * @param content タスク
     */
    public writeLine = async (content: string) => {
        await writeFile(this.filePath, `${content}\n`, {flag: 'a+'});
    }
}