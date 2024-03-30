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


const environment = process.env.NODE_ENV || "prod";


let serverOrigin = "http://localhost:8080/";
// if (environment === "local") {
//     console.log("LOCAL SERVER -- http://localhost:8080/");
//     console.log(environment);
//     serverOrigin = "http://localhost:8080/";
// } else {
//     console.log("PRODUCTION -- heroku");
//     console.log(serverOrigin);
// }

console.log(serverOrigin);


//Initialize application with route
app.use(express.static(path.join(__dirname, 'public')));

// REST API

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'))
});



//  WEB SOCKET PART

const io = require('socket.io')(server, {
    cors: {
        origin: serverOrigin,
        methods: ["GET", "POST"]
    }
});

const messageFunc = (from, msg) => {
    console.log("debugging messageFunc")
    console.log(from)
    console.log(msg)

    // add more complex logic here
    io.emit('server-message', from, msg);
}

io.on('connection', function (socket) {
    socket.on('message', messageFunc);

    
});



let fakeMeetingsList = []


app.get('/api/zoom/fake/meeting', (req, res) => {
    //  TODO: use file sync to read json of real zoom date
    io.emit('server-message', JSON.stringify({
        "content": "this is a totally fake thing",
        "from": "fake",
        "type": "text",
        "room": "hard-coded"
    }));
    res.send({status: 200});
});




// Listen appliaction request on port 80
server.listen(process.env.PORT || 8080, '0.0.0.0', function () {
    console.log('Server Running in port 8080');    
});


// //Register events on socket connection

