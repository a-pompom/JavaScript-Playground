/**
 * ユーザの入力を受け付け、各種モジュールを呼び出すことを責務に持つ
 */
export class TodoController {

    static START_MESSAGE = 'Start';

    constructor() {}

    /**
     * 開始処理
     */
    public run = (): void => {

        console.log(TodoController.START_MESSAGE);
    }
}