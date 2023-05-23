// expressの準備
const express = require("express");
const app = express();
// expressからhttpをインストール
const http = require("http");
const { Socket } = require("socket.io");
// httpのcreateServerにexpressをいれて情報をserverに格納
const server = http.createServer(app);
// socket.ioを格納してserverを引数に渡す（socket.ioはリアルタイムでやり取りをさせるライブラリ)
const io = require("socket.io")(server);
// PORT番号を代入
const PORT = 3000;

// --------------------------API関連のインポート------------------------------

// requestのモジュールをインポート
const { config } = require("dotenv");
const request = require("request");
// dotenvのモジュールをインポート
const dotenv = require("dotenv").config();

// ---------------------------------------------------------------------------

// ルートディレクトリでindex.htmlを表示する(_dirnameは現在のディレクトリを指す)
app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
});

// onメソッド(送信されたものを受け取るメソッド)でクライアントサイドのio()を受け取ったら実行される処理
io.on("connection", (socket) => {
    console.log("ユーザーが接続しました");
    // emitで送信したchat messageをmsgという変数で受け取る
    socket.on("chat message", (msg) => {

// -----------------------------APIの設定（ここを変更すればchatGPTを使える）--------------------------------------

// apiの情報をoptionに格納
const options = {
    // どのようなurlで叩くのかの情報を書く
    url: `https://api.openweathermap.org/data/2.5/weather?q=${msg}&units=metric&appid=${process.env.API_KEY}`,//保守性を挙げるためにAPIKeyを環境変数として入れ込む
    // GETメソッドで情報を読み取るように設定する
    method: "GET",
    // json形式にして見やすいようにする処理
    json: true,
};

// -----------------------------------------------------------------------------------------------------------------

request(options, (error, res, body) => {

    //サーバーが受け取った入力内容を再度クライアントに送ってサーバーに接続している人同士で見れるようにする処理
    io.emit("chat message", `現在の${msg}の気温は${body.main.temp}度です`);
    });
});
});

// listenメソッドを使って3000番でサーバーを構築
server.listen(PORT, () => {
    console.log("listening on 3000");
})