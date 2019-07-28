function hontoNotifier() {
    var discordWebhookURL = "YOUR_WEBHOOK_URL_HERE"; // https://discordapp.com/api/webhooks/...

    var threads = GmailApp.search(
        "from:mail@honto.jp subject:【honto】ご注文完了のお知らせ label:unread"
    );

    threads.forEach(function(thread) {
        var messages = thread.getMessages();
        messages.forEach(function(message) {
            var body = message.getBody();

            var apiRes = UrlFetchApp.fetch(
                "https://honto-order-mail-parser.eai.now.sh/v1/parse",
                {
                    method: "post",
                    payload: {
                        html: body
                    }
                }
            );
            var apiObj = JSON.parse(apiRes);
            var embeds = [];

            apiObj.forEach(function(book) {
                embeds.push({
                    title: book.title,
                    url: book.link,
                    thumbnail: {
                        url: book.images[265]
                    },
                    fields: [
                        {
                            name: "著者",
                            value: book.author,
                            inline: true
                        },
                        {
                            name: "価格",
                            value: book.price,
                            inline: true
                        }
                    ]
                });
            });

            console.log(embeds);

            // POSTデータ
            var payload = {
                username: "honto",
                avatar_url: "https://honto.jp/favicon.ico",
                content: "📚新しい本を購入しました。",
                embeds: embeds
            };

            // POSTオプション
            var options = {
                method: "POST",
                contentType: "application/json",
                payload: JSON.stringify(payload)
            };

            console.log(payload);
            var url = discordWebhookURL;
            var res = UrlFetchApp.fetch(url, options);

            message.markRead(); // Mark as read
        });
    });
}
