const express = require('express')
const fs = require('fs')
const http = require('http')
const rll = require('read-last-lines')
const socketio = require('socket.io')
const app = express();
const PORT = process.env.PORT||8888
let server = http.createServer(app);
const io = socketio(server);
// try {
//     const data = fs.readFileSync('./root/data.txt', 'utf8')
//     console.log(data)
// } catch (err) {
//     console.error(err)
// }

const file = './root/data.txt'
app.use('/tail', express.static('public'));
 // rll.read(file,10)
 //     .then(lines=> console.log(lines))
 //     .catch(err => console.log(err.message));

// fs.watchFile('./root/data.txt', (curr, prev) => {
//     console.log(`the current change is: ${curr.file}`);
//     console.log(`the previous change was: ${prev.file}`);
// });

io.on('connection',(socket) => {
    console.log('user connected');
    fs.watchFile(file,() => {
        rll.read(file,10)
            .then(lines => socket.emit('fileChanged',
                {
                    text:lines,
                    changedAt:Date().toString()
                })
            );
    });
});


 server.listen(PORT,()=>{console.log('server successfully created')})

module.exports = app;