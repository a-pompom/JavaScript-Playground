# React + TypeScript環境が欲しいので、webpackに入門してみる

## 概要

ReactとTypeScriptでちょっとしたコードを書きたいときに、毎回webpackのあれこれを忘れてしまうので、
備忘録がてら設定・使い方の基本を整理してみます。

記事はGitHubで公開しておりますので、間違い等ございましたら、PRやIssueでご指摘頂けるとうれしいです。

## 対象読者

ReactとTypeScriptをサクッと使いたいけれど、webpackなんもわからん...といったときに
読んでいただけると、何か得るものがあるかもしれません。

体系的にwebpackを学びたい方には、[速習 webpack 第2版](https://wings.msn.to/index.php/-/A-03/WGS-JST-002/)がおすすめです。


## webpackとは

まずはwebpackとはなんぞや、を押さえておきたいところです。
公式いわく、
> webpack is a module bundler. Its main purpose is to bundle JavaScript files for usage in a browser, yet it is also capable of transforming, bundling, or packaging just about any resource or asset.

ブラウザで読み込むJavaScript(以降、JS)を、1ファイルにまとめるためのモジュールバンドラがwebpackである、とあります。
モジュール(ここでは1つのJSファイル)を1ファイルに束ねる(bundle)機能から、モジュールバンドラと表現されています。

細かな歴史は割愛しますが、元々は、リクエストの負荷を軽減させたり、依存関係の解決を自動化するためにつくられたようです。
最近では、JSファイル以外にもscss・画像ファイルなど、さまざまな形式をサポートするようになっていますが、
まずは、いい感じにJSファイルを1つにまとめてくれる、ぐらいの認識で大丈夫だと思います。

とにかくたくさんの機能がありますが、本記事では、React + TypeScript環境をつくるのに必要なものに絞って見ていきます。

#### 補足: 依存関係とは

依存関係はやや難解な表現なので、ここで簡単に補足しておきます。

ブラウザでJSを読み込む際は、記述の順番も重要となります。
例えば、共通機能をつくったときは、共通機能を呼び出しているモジュールを先に読み込んでしまうと、共通機能が見えないため、
動作しなくなってしまいます。

```HTML
<!DOCTYPE html>
<html>
    <!-- ...省略 -->
    <body>
        <!-- ライブラリ間の順序関係が存在 -->
        <script src="libaryr_hoge.js"></script>
        <script src="libary_needs_hoge.js"></script>
        <!-- 自作モジュールも、参照されるものを先に書かなければならない -->
        <script src="./common.js"></script>
        <script src="./app.js"></script>
    </body>
</html>
```

自分のつくったファイルであれば、なんとか順番を保てるかもしれないですが、これがライブラリ同士の関係も考えるようになると、
手に負えなくなります。

webpackがあれば、このような複雑な順序関係、すなわち依存関係も気にする必要がなくなるのです。

```HTML
<!DOCTYPE html>
<html>
    <!-- ...省略 -->
    <body>
        <!-- webpackにより、1ファイルにまとめられる -->
        <script src="./app.js"></script>
    </body>
</html>
```


## まずはインストール

公式の手順に沿ってnpmでインストールしていきます。

```zsh
$ npm init -y
$ npm install --save-dev webpack

$ cat package.json

{
    ...
    "devDependencies": {    # 補足: devDependenciesは、開発時のみ必要なパッケージ情報を記載します。
        "webpack": "^5.21.2"
      }
}
```

さくっとインストールできましたので、早速あれこれ触っていきます。


## 基本〜JSファイルをまとめたい

いきなりReactやTypeScriptに踏み込むと、情報量が多くなって混乱してしまいます。
簡単な機能で基礎を学ぶために、複数のJSファイルをまとめることから始めます。

### 設定ファイルの基本

とりあえずwebpackを使ってみたいとき、最初につまずくのが、「設定ファイルの書き方が分からない」ことだと思います。
私は本を読んでも数秒で忘れるので、ここで簡単にまとめておきます。

まずは、設定用ファイルとしてwebpack.config.jsを作成し、次のように記述します。
※ webpack.config.jsは、webpackが参照する設定ファイルのデフォルト値です。

```JavaScript
const path = require('path');

module.exports = {
    /* 入力 */
    entry: './src/entry.js',                            /* エントリーポイント */
    /* 出力 */
    output: {                                           /* バンドル結果の出力先 */
        path: path.join(__dirname, 'output'),           /* 出力先ディレクトリ */
        filename: 'output.js'                           /* 出力ファイル名 */
    }
};
```

基本の設定では、webpackへ、「どのファイルを起点にまとめ、まとめた結果をどこに出力するか」を提示します。
直感的に理解できそうな内容ですが、各プロパティの概要を簡単に記載しておきます。
プロパティ名は、公式ドキュメントへのリンクとなっているので、詳細を掘りたいときに探ってみてください。

#### [entry](https://webpack.js.org/concepts/entry-points/)

バンドル時のエントリーポイントを文字列形式で記述します。
ソースとライブラリを分離させるためにオブジェクト形式で記述できたりと、他にも色々な書き方・オプションがあります。
ですが、ReactとTypeScriptを動かす分には、いわゆる「index.tsx」のように、1ファイルのみの設定でも何とかなるかと思います。

#### [output](https://webpack.js.org/concepts/output/)

バンドル結果の出力先を指定します。
こちらも多くのオプションが存在しますが、まずは、どこに出力するかを提示する「path」・「filename」を
押さえておきましょう。


### JSファイルをまとめてみる

設定が有効になったか確認するために、実際にwebpackにJSファイルをまとめてもらいましょう。
実験用にいくつかのファイルを用意します。

```JavaScript
// src/world.js
export const world = 'World';
```

```JavaScript
// src/entry.js
import { world } from './world';

console.log(`Hello, ${world}!!`);
```

そして、webpackコマンドで、1つに合体させます。

```bash
# ※ configオプションに指定したファイル名はデフォルト値と同じなので、以降では省略します
$ npx webpack --config=webpack.config.js

# 出力例
    Asset       Size  Chunks             Chunk Names
output.js  981 bytes       0  [emitted]  main
Entrypoint main = output.js
[0] ./src/entry.js + 1 modules 96 bytes {0} [built]
    | ./src/entry.js 67 bytes [built]
    | ./src/world.js 29 bytes [built]

# 出力ファイル実行結果
$ node ./output/output.js 
Hello, World!!
```

赤字でエラーが表示されていなければ、上手くいったはずです。
設定ファイルで入出力を提示しておけば、webpackがよしなにまとめてくれます、便利ですね。

※ webpack4系以降の場合は、modeプロパティが無いと警告が表示されますが、後ほど解決していきます。

#### 補足: npxとは

npmパッケージに付属しているCLIコマンドを手軽に実行するためのパッケージです。
たくさんの便利な機能がありますが、ひとまずは、`./node_modules/.bin/webpack ...`とか
書かないといけないのを、`npx webpack ...`でシンプルにしてくれるんだな〜、ぐらいの認識で大丈夫です。

[参考](https://www.npmjs.com/package/npx)

## 開発サーバが欲しい

Reactを使う際、ルーティングなどで開発サーバが必要となります。
開発サーバは、設定ファイルに少しだけ追記し、パッケージを導入するだけで簡単に使えるようになるので、
ここでつくってみましょう。

### パッケージのインストール

webpackが提供している「webpack-dev-server」パッケージをインストールします。
こちらもnpmパッケージで公開されているので、webpackと同様、コマンド1つでインストールできます。

```bash
$ npm install --save-dev webpack-dev-server
```

### 開発サーバ用の設定

設定ファイルへ、開発サーバの動作を提示するための記述を追記します。
こちらも直感的に理解できる内容ですので、実際に追記した例から見ていきたいと思います。

```JavaScript
const path = require('path');

module.exports = {
    /* バンドルモード */
    mode: 'development',                                /* developmentモードでは、デバッグに便利な設定を適用 */
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
        host: 'localhost',                              /* ホスト名 */
        port: 30000                                     /* 配信先port */
    }
};
```

先ほど基本設定を見たときと同じように、新たに追加された設定の概要を追っていきます。

#### [mode](https://webpack.js.org/configuration/mode/)

基本的には、「development, production」の2択で、バンドル結果のファイルに影響を与えます。
モードによってさまざまな違いはありますが、大まかには、developmentは、デバッグに便利な情報を提供し、
productionでは、速度を重視し、必要最小限の情報のみに切り捨てる、ぐらいを理解しておけば良いかと思います。

#### [devServer](https://webpack.js.org/configuration/dev-server/)

開発サーバ本体であるwebpack-dev-serverの設定を提示します。
公式にもありますが、閲覧用のHTMLを組み立ててくれるわけではないので、JSファイルの
動作を確認したい場合は、scriptタグを記述したHTMLを新たに作成する必要があります。

#### [devServer.contentBase](https://webpack.js.org/configuration/dev-server/#devservercontentbase)

開発サーバ上で静的ファイル(HTML, CSS, JSなど)を配信するときの、起点となるパスを指定します。
デフォルト値は、「webpack-dev-server」コマンドを実行したディレクトリ(Current Working Directory)が設定されています。

通常は、webpackのバンドル結果を格納したディレクトリを設定することが多いようです。

#### [devServer.host](https://webpack.js.org/configuration/dev-server/#devserverhost)

開発サーバが動作するホストを指定します。ホスト名・IPアドレスいずれも指定可能ですが、
今回はローカルでの動作確認用に「localhost」で固定します。

#### [devServer.port](https://webpack.js.org/configuration/dev-server/#devserverport)

開発サーバがリクエストを受け付けるポート番号を指定します。
他のプロセスと競合しないものであれば、なんでも大丈夫です。


### 動作確認

さて、この状態で開発サーバを起動して動作を確認してみましょう。

```bash
$ npx webpack-dev-server
ℹ ｢wds｣: Project is running at http://localhost:30000/
ℹ ｢wds｣: webpack output is served from /
# パスの一部は省略
ℹ ｢wds｣: Content not from webpack is served from webpack_playground/output
ℹ ｢wdm｣: asset output.js 367 KiB [emitted] (name: main)
```

上記コマンドを実行し、開発サーバの起動が確認できたら、「http://localhost:<port_number>」を表示してみます。
すると、図のように、ディレクトリーツリーが表示されます。

![image](https://user-images.githubusercontent.com/43694794/108585027-3ad9d400-7389-11eb-88f1-af1acda05f88.png)

webpack-dev-serverは開発用の「Webサーバ」として動作しているので、コンテンツの配信ルールは、
一般的なWebサーバプログラムと似たものが適用されます。
つまり、ディレクトリアクセスの場合、「index.html」が存在すれば、それを表示する挙動をとってくれます。

[参考](https://httpd.apache.org/docs/trunk/getting-started.html#content)

もう少しいい感じに動いているところを見たいので、簡単なHTMLファイルをつくってみます。
それに合わせ、JavaScriptファイルにも少しだけ手を加えます。

```HTML
<!DOCTYPE html>
<html>
    <head>
    <meta charset="utf-8">
    <title>Webpack</title>
    </head>

    <body>
        <!-- index.html -->
        <h1 id="content"></h1>
        <script src="./output.js"></script>
    </body>
</html>
```

```JavaScript
// src/entry.js
import { world } from './world';

// console.logでは結果が見えづらいので、HTMLへ描画するよう変更
document.getElementById('content').textContent = `Hello, ${world}!!`;
```

以上のように変更した上で、どのように表示が変わるのか見てみます。

![image](https://user-images.githubusercontent.com/43694794/108585194-73c67880-738a-11eb-8350-f8ab558a9fb2.png)

見事、世界にあいさつできました。
これで、ルーティングが必要になっても、さくっと開発サーバを用意することができます。


#### 補足 なぜwebpackでは絶対パスが推奨されているのか

さて、細かな話ですが、webpack公式では、output.pathの記述にて、
> The output directory as an absolute path.

とありました。devServer.contentBaseでも絶対パスを推奨する旨が書かれています。

これには何か理由があるのでしょうか。
公式では明確に言及されていませんでしたが、おそらく、Node.jsのファイル操作モジュールに影響していると思われます。
ファイル操作モジュールは、Node.jsのプロセスが実行された箇所を相対パスの起点とするため、
実行方法によっては、webpackがパスを誤って解釈し、バンドルが動作しなくなってしまいます。

こういったことから、絶対パスが推奨されるようになったのではないかと思われます。
[参考](https://stackoverflow.com/questions/48354238/why-webpack-config-has-to-use-path-resolve-path-join)

※ 対して、entryプロパティは相対パスとなっていますが、これはNode.jsのrequire関数の解決ルールに則っているためだと思われます。


## loaderを使って更に便利に

さて、これだけでもJSファイルをまとめたり、開発サーバを動かしたり、と色々なことができるようになりました。
しかし、React・TypeScriptを動かすには、まだ足りません。

より具体的には、JSXファイルの変換・TypeScriptファイルのコンパイルが必要となります。
これらは、バンドル(1つにまとめる)とは異なる機能なので、webpackでは「loader」で提供されています。

### loaderとは

loaderはJSXやTypeScriptを変換してくれたりと、なにやらたくさんの機能を持っているように見えます。
公式のloaderの記述を参照してみると、

> They allow you to pre-process files as you import or “load” them.

と書かれています。
どうやら、「ファイルをimportあるいは読み込んだ際に前処理を実行するもの」がloaderであるようです。
多くの場合、loaderは、npmパッケージとして公開されており、開発サーバと同様、パッケージのインストール・設定ファイルへの追記
だけで使い始めることができます。

loaderの雰囲気が掴めたところで、まずはイメージが掴みやすいTypeScript→JavaScriptへの変換をloaderに
依頼してみます。

## TypeScriptのコンパイル

[公式](https://webpack.js.org/guides/typescript/)を参考に、TypeScriptファイルをJSファイルへコンパイルする
loaderを実際に使ってみましょう。

### パッケージのインストール

最初に必要なパッケージをインストールしておきます。
TypeScript本体と、loader(ts-loader)・更に、やんごとなき事情でwebpack-cliを追加します。

```bash
$ npm install --save-dev webpack-cli typescript ts-loader
```

#### 補足 webpack-cliはなぜ必要か

※ webpack-cliパッケージ無しでコンパイルを実行すると、エラーとなるため、追加でインストールしています。
色々と調べてみましたが、バージョン絡みだったり、ライブラリ同士の関係だったりと、現時点の私の知識では
原因にたどり着けそうにありませんでした。

何かご存知でしたらIssueなどで教えて頂けるととうれしいです。
[参考](https://github.com/vercel/next.js/issues/5781)


### TypeScriptの設定

本来であれば、ここでTypeScript用の設定をあれこれ書いていくのですが、本記事ではとりあえず動かすことが
目的なので、初期設定のままにしておきます。
初期設定は、下記のコマンドで自動生成してくれます。

```bash
# tscはTypeScript Compilerの略
$ tsc --init
```

### loaderの設定

webpackへ、バンドルで一緒にTypeScriptのコンパイルも依頼できるよう、loaderの設定を書いていきます。
例のごとく、実際の設定値を俯瞰した上で、各種設定の概要をなぞります。

```JavaScript
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
```

#### [module](https://webpack.js.org/configuration/module/)

moduleプロパティは、モジュール(ここではJSファイルに限らずバンドルの対象となるものを指します)をどう扱うか設定します。
ReactやTypeScriptの変換では、loaderによる前処理のために必要となります。

#### [rules](https://webpack.js.org/configuration/module/#modulerules)

バンドル対象のモジュールが指定の規則に合致した場合、
後述のuseプロパティに設定されたもの(大体はloader)を適用します。

こう書くと難しそうですが、ReactやTypeScriptを使う分には、拡張子でモジュールをより分けて、
loaderを適用しているんだな〜、といった感覚で大丈夫です。

#### [Rule.test](https://webpack.js.org/configuration/module/#ruletest)

useプロパティに指定されたloaderを適用する条件を記述します。
多くの形式がありますが、最初のうちは正規表現による拡張子だけでも十分です。

また、JSの正規表現は、`/expression/`で記述するので、設定に記述した`/\.ts$/`は、モジュール名の末尾が
.tsで終わるもの、つまり、拡張子がtsであることを表しています。

#### [Rule.use](https://webpack.js.org/configuration/module/#ruleuse)

testプロパティの条件に合致したモジュールへ適用するもの(大抵はloader)を指定します。
公式では、「UseEntry」と呼ばれるオブジェクト形式が対象となっています。
ですが、とりあえず簡単な変換処理をするだけであれば、loader名の文字列でも問題ないと思います。

※ 文字列指定は、loaderプロパティを持つUseEntryオブジェクトのショートカットです。

#### [Rule.exclude](https://webpack.js.org/configuration/module/#ruleexclude)

testプロパティの条件に合致したけれど、loaderは適用したくないモジュールを指定します。
指定方法はtestプロパティと同様ですが、ここでは、おなじみのnode_modulesディレクトリのみを記述します。
node_modules配下も毎回コンパイルしていると、非常に遅くなってしまうので、必要最低限のモジュールのみへ
絞り込んであげます。

---

ここからは、loaderそのものの設定ではなく、モジュール解決のための設定に触れていきます。
あと一息でReact・TypeScriptを動かす環境を手に入れるための知識がそろうので、頑張っていきましょう。

#### [resolve](https://webpack.js.org/configuration/resolve/)

webpackがモジュールを解決するときの補足情報を提示します。

webpackは、「enhanced-resolve」という規則に則りモジュールを解決、つまり探しに行きます。
JSファイルのバンドルだけであれば、何も設定しなくてもよしなに解決してくれます。
しかし、TypeScriptを例に考えてみます。

```TypeScript
// src/index.ts
import { World } from './module';

console.log(`Hello, ${World}!!`);
```

webpackは、import文からモジュールを探しに行きます。
後述するresolve.extensionsプロパティが設定されていない場合、デフォルト値として、拡張子が「.wasm, .mjs, .js, .json」の
ファイルを見つけようとします。

TypeScriptファイル(.ts)はプロパティ値に設定されていないため、このままではモジュールとして
見つけられません。
これではloaderを適用できず、エラーとなってしまうので、モジュールの解決情報も提示する必要があります。

[参考](https://webpack.js.org/concepts/module-resolution/)


#### [resolve.extensions](https://webpack.js.org/configuration/resolve/#resolveextensions)

前述の通り、webpackのバンドルでモジュールの解決が必要となったとき、どの拡張子を探しに行くか提示します。
TypeScriptファイル(.ts)を見つけてもらうために、拡張子を追記しておきます。

また、同名で拡張子の異なるファイルを作成したときは、extensionsプロパティの配列を先頭から探索し、
最初に合致したもののみがバンドル対象となります。

---

最後の仕上げとして、コンパイル用の簡単なTypeScriptファイルを用意しておきます。

```TypeScript
// ./src/module.ts
export const World = 'TypeScript';
```

```TypeScript
// ./src/index.ts
import { World } from './module';

console.log(`Hello, ${World}!!`);
```


### いざコンパイル

少し長くなりましたが、ようやくコンパイルの準備が整いました。
準備とは裏腹に、コンパイルでやることはとてもシンプルで、これまで通りwebpackコマンドを実行するだけです。

早速、コンパイルしてみます。

```bash
$ npx webpack
asset output.js 2.66 KiB [compared for emit] (name: main)
./src/index.ts 161 bytes [built] [code generated]
./src/module.ts 131 bytes [built] [code generated]
webpack 5.23.0 compiled successfully in 1705 ms

# 動作確認
$ node ./output/output.js 
Hello, TypeScript!!
```

問題なく動いていますね。
長くなりましたが、これで、webpackでバンドルだけでなく、loaderによる変換もできるようになりました。

## React + TypeScriptでHello World

これまでの知識を組み合わせ、いよいよゴールである、ReactとTypeScriptが動く環境をつくっていきます。

### パッケージのインストール

ReactとTypeScriptが動く環境を1から作りたくなったときに戻ってこられるよう、
`npm init`から始めていきます。

```bash
$ npm init -y
# webpack一式とTypeScriprt・型定義(後述)
# 本番環境ではバンドルされたJavaScriptファイルのみ必要なので、devDependenciesで指定
$ npm install --save-dev webpack webpack-dev-server webpack-cli typescript ts-loader @types/react @types/react-dom
# Reactパッケージ Reactによるレンダリングは、本番環境でも必要となるので、dependenciesで指定
$ npm install --save react react-dom

# パッケージのインストール結果
$ cat package.json
{
  ...
  "devDependencies": {
    "@types/react": "^17.0.2",
    "@types/react-dom": "^17.0.1",
    "ts-loader": "^8.0.17",
    "typescript": "^4.1.5",
    "webpack": "^5.23.0",
    "webpack-cli": "^4.5.0",
    "webpack-dev-server": "^3.11.2"
  },
  "dependencies": {
    "react": "^17.0.1",
    "react-dom": "^17.0.1"
  }
}
```

reactパッケージは、Reactを使う上で必要なことがなんとなくイメージできます。
typesパッケージも、TypeScriptで必要な型定義を持っているように見えますが、`@types`という見慣れない表現が
あります。

「@」は名前空間を表し、`@npmユーザ名/パッケージ名`のように使われています。
`@npmユーザ名`がユニークであることから、パッケージの信頼性・一意性を担保するのに有用です。

[参考](https://docs.npmjs.com/cli/v7/using-npm/scope)


### webpackの設定

webpackでJSXを変換する場合、Babelと呼ばれるトランスパイラを利用しているのを見かけるかもしれません。
しかし、現在では、ありがたいことにTypeScriptがJSXの変換をサポートしてくれるようになったので、
TypeScriptのコンパイル設定を記述するだけで、Reactも使えるようになりました。

よって、設定ファイルをほとんど変えることなく、Reactにも対応させることができます。
復習がてら、再度設定を確認しておきましょう。

```JavaScript
const path = require('path');

module.exports = {
    /* ビルドオプション */
    mode: 'development',                                /* developmentモードでは、ビルド後にデバッグ用の情報を残す */

    /* 入力 */
    entry: './src/index.tsx',                            /* エントリーポイント */
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
    },

    /* webpackがバンドルするモジュールをどう扱うか */
    module: {
        /* loaderをモジュールへ適用するための規則 */
        rules: [
            {
                /* .ts or .tsxを対象 */
                test: /\.tsx?$/,                          /* assertionが通ったモジュールにのみloaderを適用 */
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
```

一点だけ変更された箇所があり、ts-loaderの適用対象が、`/\.tsx?$/`となりました。
これは、JSXを含むTypeScriptファイル(.tsx)・通常のTypeScriptファイル(.ts)ファイル双方に対応するための記述です。

#### 補足 そもそもBabelとは

> Babel is a toolchain that is mainly used to convert ECMAScript 2015+ code into a backwards compatible version of JavaScript in current and older browsers or environments. 

と、[公式](https://babeljs.io/docs/en/index.html)で書かれている通り、最近のJSのコードを、古いブラウザや環境でも動作するよう変換する、というのがBabelの元々の機能です。
webpackと同じように、どうせ変換するなら、TypeScript・JSXも...と対応していったため、webpackのloaderと近い機能を
持つようになりました。

### JSXを変換

さて、TypeScriptのコンパイラにJSXも一緒にコンパイルしてもらうためには、コンパイルオプションを
変更する必要があります。
変更といっても、設定ファイルのコメントにある通り書き換えるだけなので、難しくありません。

```bash
# 初期設定用の設定ファイルを生成
tsc --init
```

```json
/* tsconfig.json */
{
  "compilerOptions": {
     /* 中略... */
    "jsx": "react",                           /* Specify JSX code generation: 'preserve', 'react-native', or 'react'. */
     /* 中略... */
}
```

上記の通り、compilerOptionsプロパティにある、jsxプロパティを「react」へ書き換えるだけで、
あとはコンパイラがよろしくやってくれます。

#### 補足 なぜjsxプロパティの書き換えが必要なのか

jsxプロパティの行のコメントに、
> Specify JSX code generation: 'preserve', 'react-native', or 'react'.

とあり、「preserve, react-native, react」のいずれかを指定するようです。
preserveは意味の通り、JSXをそのままにしておき、変換をBabelなどへ委譲します。
react-nativeの場合も、JSXはそのままになるようです。
reactは、ブラウザがJavaScriptとして解釈できるよう、HTMLっぽく書かれたJSXを、`React.createElement()`メソッド呼び出しへ変換します。

このように、用途によってTypeScriptコンパイラはJSXの扱いを切り替えるようになっているので、
明示的な指定が必要となります。

[JSX参考](https://reactjs.org/docs/introducing-jsx.html#jsx-represents-objects)
[TypeScript jsxオプション参考](https://www.typescriptlang.org/docs/handbook/jsx.html)


### ゴール

設定が完成したので、最後の動作確認をしていきます。
Reactが動いてくれたか検証するため、いくつかファイルを用意します。

```HTML
<!DOCTYPE html>
<html>
    <head>
    <meta charset="utf-8">
    <title>Webpack</title>
    </head>

    <body>
        <!-- output/index.html -->
        <!-- Reactコンポーネントのルート要素 -->
        <div id="root"></div>
        <script src="./output.js"></script>
    </body>
</html>
```

```TypeScript
// src/index.tsx
import React from 'react';
import ReactDOM from 'react-dom';
import { World } from './world';

ReactDOM.render(
   <h1>Hello, {World}!!</h1> ,
   document.getElementById('root')
);
```

```TypeScript
// src/world.ts
export const World = 'React';
```

そして、開発サーバを起動し、ページを表示してみます。

```bash
$ npx webpack-dev-server
ℹ ｢wds｣: Project is running at http://localhost:30000/
ℹ ｢wds｣: webpack output is served from /
ℹ ｢wds｣: Content not from webpack is served from /Users/aoi/Desktop/works/webpackPlayground/4-react-ts/output
ℹ ｢wdm｣: asset output.js 1.35 MiB [emitted] (name: main)
# 中略...
  ./src/index.tsx 504 bytes [built] [code generated]
  ./src/world.ts 126 bytes [built] [code generated]
webpack 5.23.0 compiled successfully in 2717 ms
```

![image](https://user-images.githubusercontent.com/43694794/108832905-78e82980-760f-11eb-9984-fef98cbfb154.png)

ついにReactとTypeScriptを動かせる環境が手に入りました。
長い道のりでしたが、道中でwebpackの基本機能を押さえることができたのではないかと思います。

---

<a id="まとめ"></a>
## まとめ

webpackで複数のJavaScriptファイルを1つにまとめることから始め、ReactとTypeScriptで開発を進めるのに
必要な環境を構築するところまで追っていきました。

まだまだwebpackには使いこせていない機能がたくさんありますが、その辺りはもう少し
webpackと格闘したら、またまとめていこうと思います。

少しでもwebpackのことを知るきっかけとなれば幸いです。