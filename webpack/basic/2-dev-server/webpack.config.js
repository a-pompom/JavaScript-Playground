const path = require('path');

module.exports = {
    /* ビルドオプション */
    mode: 'development',                                /* developmentモードでは、ビルド後にデバッグ用の情報を残す */
    /* 入力 */
    entry: './src/entry.js',                            /* エントリーポイント */
    /* 出力 */
    output: {                                           /* バンドル結果の出力先 */
        path: path.join(__dirname, 'output'),           /* 出力先ディレクトリ */
        filename: 'output.js'                           /* 出力ファイル名 */
    },

    /* 開発サーバ */
    devServer: {                                        /* 開発サーバ用の設定 */
        contentBase: path.join(__dirname, 'output'),    /* 開発サーバが扱うファイルのルートパス 主に静的ファイルのために利用 */
        host: 'localhost',                              /* devServerの動作するホスト名 */
        port: 30000                                     /* devServerの動作するport */
    }
};