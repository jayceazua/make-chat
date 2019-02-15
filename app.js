const path = require('path');
const express = require('express');
const methodOverride = require('method-override');
const hbs = require('express-handlebars');
const app = express();
const port = process.env.PORT || 3000;
//Socket.io has to use the http server
const server = require('http').Server(app);

// database connection
// require("./database/mongoConnection");

// Socket.io setup backend for incoming socket connections!
const io = require("socket.io")(server);
// we'll store our online users here
let onlineUsers = {}
//Save the channels in this object.
let channels = {"General": []};
io.on("connection", (socket) => {
  // This file will be read on new socket connections
  // console.log("🔌 New user connected! 🔌")
  require('./sockets/chat')(io, socket, onlineUsers, channels);
});

app.engine('hbs', hbs({
  extname: 'hbs',
  defaultLayout: 'main',
  layoutsDir: __dirname + '/views/layouts'
}));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({
  extended: false
}));
app.use(methodOverride('X-HTTP-Method-Override'));
app.use(methodOverride('_method'));
app.use(methodOverride((req, res) => {
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    let method = req.body._method;
    delete req.body._method;
    return method;
  }
}));

// routes
app.get('/', (req, res) => {
  res.render('index')
})

server.listen(port);