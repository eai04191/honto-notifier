function hontoNotifer() {

    var discordWebhookURL = "YOUR_WEBHOOK_URL_HERE"; // https://discordapp.com/api/webhooks/...

    var __iterator = function (collection, howMany) {
        var count = 0;
        var __next = function () {
            var index = howMany * count;
            var result = collection.slice(index, index + howMany);
            count += 1;
            return result;
        };
        var __hasNext = function () {
            var index = howMany * count;
            return collection.slice(index, index + howMany).length > 0;
        };
        return {
            next: __next,
            hasNext: __hasNext
        };
    };

    var threads = GmailApp.search("from:mail@honto.jp subject:【honto】ご注文完了のお知らせ label:unread ");

    threads.forEach(function (thread) {
        var messages = thread.getMessages();
        messages.forEach(function (message) {
            var body = message.getBody();
            var text = body.replace(/<("[^"]*"|'[^']*'|[^'">])*>/g, "");

            // 空行削除
            var text = text.replace(/^\r\n+/gm, "");

            // 空白削除
            var text = text.replace(/^\s+/gm, "");

            var orderNum = text.match(/ご注文番号：(D\d+)/)[1];

            //　最初を消す
            var text = text.replace(/honto[\s\S]*価格（税込）\r/g, "");

            // 後ろ消す
            var text = text.replace(/\rご注文金額の合計[\s\S]*禁じます。\r/g, "");

            //
            var text = text.replace(/(一般書|コミック)\r/g, "");

            //      Logger.log(orderNum);
            //      Logger.log(text);

            var array = text.split(/\r\n|\r|\n/);
            var str = "";
            //      Logger.log(array);

            var iter = __iterator(array, 5);

            var embeds = [];

            // 本毎の処理
            while (iter.hasNext()) {
                var data = iter.next();
                Logger.log(data);

                var format = data[0]; // 電子書籍
                var title = data[1];
                var author = data[2];
                var author = author.replace(/著者(：|:)/g, "");
                var kikan = data[3];　 // ダウンロード期間：-
                var price = data[4];

                var searchUrl = "https://honto.jp/ebook/search_10" + encodeURIComponent(title) + ".html";

                embeds.push({
                    "title": title,
                    "url": searchUrl,
                    "fields": [{
                            "name": "著者",
                            "value": author,
                            "inline": true
                        },
                        {
                            "name": "価格",
                            "value": price,
                            "inline": true
                        }
                    ]
                });
            }

            // POSTデータ
            var payload = {
                "username": "honto",
                "avatar_url": "https://honto.jp/favicon.ico",
                "content": "📚新しい本を購入しました。",
                "embeds": embeds
            };

            // POSTオプション
            var options = {
                "method": "POST",
                "contentType": "application/json",
                "payload": JSON.stringify(payload)
            };

            Logger.log(payload);
            var url = discordWebhookURL;
            var response = UrlFetchApp.fetch(url, options);

            message.markRead(); // Mark as read

            Utilities.sleep(1000);


        });
    });
}