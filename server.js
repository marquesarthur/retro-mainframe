// const path = require('path')
// const fs = require('fs');
// const express = require('express')
//
// const app = express()
//
// app.use(express.static(path.join(__dirname, 'public')))
//
// app.get('/ping', (req, res) => {
//   return res.send('pong')
// })
//
// app.get('/', (req, res) => {
//   res.sendFile(path.join(__dirname, 'public', 'index.html'))
// })
//
// app.listen(process.env.PORT || 8080)

// const path = require('path')
// const app = require('http').createServer(handler);
// const io = require('socket.io')(app);
// const fs = require('fs');
// const express = require('express');
//
// app.listen(process.env.PORT || 8080);
//
// function handler (req, res) {
//   fs.readFile(path.join(__dirname, 'public', 'index.html'),
//       function (err, data) {
//         if (err) {
//           res.writeHead(500);
//           return res.end('Error loading index.html');
//         }
//
//         res.writeHead(200);
//         res.end(data);
//       });
// }
//
// io.sockets.on('connection', function (socket) {
//   socket.emit('news', {
//       hello: 'world'
//   });
//   socket.on('my other event', function (data) {
//     console.log(data);
//   });
// });


const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');
const server = require('http').createServer(app);



//Initialize application with route
app.use(express.static(path.join(__dirname, 'public')));


app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'))
})

// Listen appliaction request on port 80
server.listen(process.env.PORT || 8080, function () {
    console.log('Server Running in port 8080');

    const io = require('socket.io')(server, {
        cors: {
            origin: "https://retro-mainframe.herokuapp.com/",
            methods: ["GET", "POST"]
        }
    });

    io.on('connection', function (socket) {
        socket.on('message', function (from, msg) {
            io.emit('server-message', from, msg);
        });
    });
});


// //Register events on socket connection

