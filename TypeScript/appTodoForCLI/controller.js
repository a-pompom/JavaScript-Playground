/**
 * ユーザの入力を受け付け、各種モジュールを呼び出すことを責務に持つ
 */
export class TodoController {
    constructor() {
        /**
         * 開始処理
         */
        this.run = () => {
            console.log(TodoController.START_MESSAGE);
        };
    }
}
TodoController.START_MESSAGE = 'Start';
//# sourceMappingURL=controller.js.map