const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const fs = require('fs')
const YAML = require("yaml")

const Length = YAML.parse(fs.readFileSync("Config.yml", 'utf8')).paste_link_length

function Random(length) {
    let randomChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += randomChars.charAt(Math.floor(Math.random() * randomChars.length));
    }
    return result;
}

app.use(express.static('public'));

http.listen(8000, '0.0.0.0', () => {
    console.log('listening on *:8000');
});

io.on('connection', function(socket) {
    socket.on("upload", function(txt) {
        let i = Random(Length)
        while (fs.existsSync(`public/p/${i}.txt`)) {
            i = Random(Length)
        }
        fs.writeFileSync(`public/p/${i}.txt`, txt)
        socket.emit("done", `./p/${i}.txt`)
    })
})