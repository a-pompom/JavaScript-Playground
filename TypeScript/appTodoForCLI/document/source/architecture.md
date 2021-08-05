# アーキテクチャ概要

## フロー概略

```{mermaid}
stateDiagram-v2
    [*] --> App
    App --> Controller
    Controller --> TaskFlow
  
    state TaskFlow {
        [*] --> Task
        Task --> TaskArg
        TaskArg --> TaskValidator
        TaskValidator --> TaskArg
        TaskArg --> Task
        
        Task --> TaskFile
    }
```

## App

開始処理の実行を責務に持つ。


---

## Controller

ユーザ入力をもとにした、各種タスク操作呼び出しを責務に持つ。
また、タスク操作結果をユーザへ伝える処理も担う。

---

```{mermaid}
sequenceDiagram
    participant App
    participant Controller
    App ->> Controller: 処理起動
    Controller ->> Task: タスク操作起動
```

---

## Taskモジュール

タスク操作を責務に持つ。
いくつかのクラスで構成されており、タスク操作コマンドの解釈・タスクそのものの操作・各種モジュール呼び出しへ
責務を分割。

### TaskArg

タスク操作コマンドの引数を解釈。

#### class TaskArgParser

タスク操作の引数解釈を責務に持つ。
`parse()`メソッドを公開し、呼び出し元へ引数オブジェクトを返却。

#### 引数オブジェクト

呼び出し元は、引数オブジェクトからどのようにタスクを操作するか決定。

#### class TaskArgValidator

タスク操作コマンドのバリデーションを責務に持つ。
バリデーション結果は通知オブジェクトへ格納。


```{mermaid}
sequenceDiagram
    participant Task
    participant TaskArgParser
    participant TaskValidator
    Task ->> TaskArgParser: 引数解釈処理呼び出し
    TaskArgParser ->> TaskValidator: 引数バリデーション処理呼び出し
    TaskValidator ->> TaskArgParser : 引数バリデーション結果返却
    TaskArgParser ->> Task: 引数オブジェクト返却
```


### Task

タスク操作周りのクラスを格納。

#### class Task

タスクのCRUD操作を責務に持つ。 本クラスは、タスクをどう操作するか明確にすることが目的である。

`command()`メソッドでユーザ入力を受け付け、内部でCRUDと対応するメソッドを呼び出す。
引数解釈は`TaskArgParser`・実体操作は`TaskFile`へ委譲。

#### 通知オブジェクト

操作結果メッセージを保持。
例外処理も考えたが、オーバーヘッドが大きいことから、notificationパターンを採用。

#### class TaskFile

タスクの実体操作を責務に持つ。
本システムでは、タスクをファイル形式で管理しており、Taskクラスからのメソッド呼び出しにより、
ファイルの中身を操作。

ファイル操作は、シンプルに書くためにPromiseオブジェクトを採用した。

---

```{mermaid}
sequenceDiagram
    participant Task
    participant TaskFile
    participant task.txt
    Task ->> TaskFile: 引数オブジェクトをもとにCRUD処理呼び出し
    TaskFile ->> task.txt: タスクを記録したファイルを操作
```
