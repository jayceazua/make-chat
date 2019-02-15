const path = require('path');
const express = require('express');
const methodOverride = require("method-override");
const hbs = require("express-handlebars");
const app = require(app);
const port = process.env.PORT || 3000;
//Socket.io has to use the http server
const server = require('http').Server(app);

// database connection
require("./database/mongoConnection");

// Socket.io setup backend for incoming socket connections!
const io = require("socket.io")(server);
io.on("connection", (server) => {
  console.log("🔌 New user connected! 🔌")
})

// Template Engine setup
app.engine('hbs', hbs({
  extname: 'hbs',
  defaultLayout: 'main',
  layoutsDir: __dirname + '/views/layouts'
}));
app.use('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(express.static(path.join(__dirname, 'public')));
// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride('X-HTTP-Method-Override'));
app.use(methodOverride('_method'));
app.use(methodOverride((req, res) => {
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    let method = req.body._method;
    delete req.body._method;
    return method;
  };
}));
// routes
app.get('/', (req, res) => {
  res.render('index')
})

server.listen(port);