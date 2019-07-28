Honto Notifier
===

Gmailで受け取ったhontoの注文完了メールをパースしてDiscordに投稿するスクリプト。

パースには[eai04191/honto-order-mail-parser](https://github.com/eai04191/honto-order-mail-parser)のAPIを使用しています。

![Preview](https://i.imgur.com/gW5YMyA.png)

## Usage

1. [GAS](https://script.google.com)で新しいスクリプトを作成する。
2. [honto-notifer.gs.js](./honto-notifer.gs.js)の中身をコピペする。
3. 2行目の`discordWebhookURL`を自分のWebhookURLに書き換える。
4. 保存して、[自分のプロジェクト](https://script.google.com/home/my)からプロジェクトを開き、トリガーを設定する。
    - ![](https://i.imgur.com/HvwoDlU.png)
    - ![](https://i.imgur.com/BR3hYNq.png)


## License

This project is licensed under the MIT License.