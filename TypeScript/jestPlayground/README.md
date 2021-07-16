# 概要

Jestの使い方メモ。
将来的には記事で整理したい...。


## Hello World

まずは手始めに、`Hello Jest`を出力する関数をテストしてみるか。

### Configuration

Jest用の設定値は、package.jsonか、jest.config.jsで記述。
npm-scriptsの近くにあった方が見やすいので、package.jsonを利用。
package.jsonでは、`jest`プロパティ配下にオブジェクトのキー・値形式で設定値を記述。

主な設定値として、以下のものを利用。

* moduleFileExtensions: 対象拡張子 tsのビルドをJestで実行すると時間がかかるので、jsのみを対象 コンパイルはIDE側で実施
* transform: babelやTypeScriptのコンパイルを設定したいときに記述 今回はES2020を対象とするので不要
* verbose: 詳細な出力を表示するか テストに失敗したときに詳しい情報が欲しいので、有効にしておく

[参考](https://jestjs.io/docs/configuration)

### テストの記述

テストは、`test(<テスト名>, () => { <テストブロック> })`形式で記述。
テスト名はassertion部分に表示されるので、ぱっと見で分かりやすいものがよい。
テストブロックでは、テストしたい機能に対するassertionを書く。assertionでは主にMatcherを組み合わせて使う。

Hello Worldでは、単純な等値比較として、`expect(<actual>).toBe(<expected>)`を採用。

### 実行オプション

npm scriptsでは、オプションとして`NODE_OPTIONS='--experimental-vm-modules --no-warnings`を指定。
これは、ESModulesによるimport/exportを有効にするためである。
当該機能は、まだ本採用されていないため、現段階ではオプションが必要。

[参考](https://jestjs.io/docs/ecmascript-modules)

#### サンプル

```TypeScript
import { sayHello } from './hello';

test('Hello World', () => {

    const actual = sayHello();
    expect(actual).toBe('Hello Jest');
});
```

## Matcher

Matcherは、assertionのために使われる、bool値を返却する関数である。
以降では、Matcherのうち、基本的なものの種類を記す。

* toBe: 等値 null値や算術比較などにも対応
* toEqual: 等価 オブジェクト同士の比較に有用 ネストしたプロパティもサポート
* not: 条件を反転
* toMatch: 正規表現
* toContain: イテラブルに要素が含まれるか

#### サンプル

```TypeScript
import { sut } from './matcher';

test('matcherのテスト-object', () => {

    const expected = {
        name: 'pom',
        age: 20,
        isLoggedIn: false
    };
    expect(sut.user).toEqual(expected);
});
test('matcherのテスト-array', () => {

    const expectedItem = 1;
    expect(sut.magicNumbers).toContain(expectedItem);
});
```

## Async

### Callbacks

コールバック関数に`done()`関数を介在させることで同期的にテストを実行。

### Promises

`.resolves()`, `.rejects()`Matcherでシンプルに比較できる。

### async/await

`test()`関数をasync関数として実行することで、非同期関数呼び出しをawaitで待機。


## Setup and Teardown

テストごとに実行される`beforeEach()`, `afterEach()`や一回切りの`beforeAll()`で
setup/teardownを実現。

また、`describe()`でテストをグループ化することで、setup/teardownにスコープが作成される。


## Mock Functions

`jest.fn()`で関数をモック化。
戻り値のmockプロパティにより、モック関数の呼び出し引数/戻り値を取得できる。

### Mocking Modules

`jest.mock(モジュール名)`でモジュールをモック化。
モック化したモジュールの`mockResolvedValue`プロパティで固定の戻り値を指定。

モック周りは以下のリンクが参考になった。
[参考](https://medium.com/@rickhanlonii/understanding-jest-mocks-f0046c68e53c)