const path = require('path');

module.exports = {
    /* ビルドオプション */
    mode: 'development',                                /* developmentモードでは、ビルド後にデバッグ用の情報を残す */
    /* 入力 */
    entry: './src/index.ts',                            /* エントリーポイント */
    /* 出力 */
    output: {                                           /* バンドル結果の出力先 */
        path: path.join(__dirname, 'output'),           /* 出力先ディレクトリ */
        filename: 'output.js'                           /* 出力ファイル名 */
    },

    /* webpackがバンドルするモジュールをどう扱うか */
    module: {
        /* loaderをモジュールへ適用するための規則 */
        rules: [
            {
                test: /\.ts$/,                          /* assertionが通ったモジュールにのみloaderを適用 */
                use: 'ts-loader',                       /* どのloaderを使用するか */
                exclude: /node_modules/                 /* どのモジュールを対象外とするか */
            }
        ]
    },

    /* モジュールを読み込む際、どう解決するか */
    resolve: {
        extensions: ['.tsx', '.ts', '.js']               /* 読み込み対象モジュールに拡張子が無い場合の解決順 */
    }
};