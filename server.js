const express = require("express");
const mongoose= require("mongoose");
const bodyParser = require('body-parser');
const app = express();
require('dotenv').config();
const server = require("http").Server(app);
const ab = require("socket.io");
const { v4: uuidv4 } = require("uuid");
app.set("view engine", "ejs");
const io = require("socket.io")(server, {
  cors: {
    origin: '*'
  }
});
const { ExpressPeerServer } = require("peer");
const peerServer = ExpressPeerServer(server, {
  debug: true,
});

if (typeof localStorage === "undefined" || localStorage === null) {
  var LocalStorage = require('node-localstorage').LocalStorage;
  localStorage = new LocalStorage('./scratch');
}

mongoose.connect( process.env.DB_URL,
  { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));
mongoose.set("useCreateIndex", true);
mongoose.set('useFindAndModify', false);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use("/peerjs", peerServer);
app.use(express.static("public"));
app.use('/', require('./routes/index'));

io.on("connection", (socket) => {
  socket.on("join-room", (roomId, userId, userName) => {
    socket.join(roomId);
    socket.to(roomId).broadcast.emit("user-connected", userId);
    socket.on("message", (message) => {
      io.to(roomId).emit("createMessage", message, userName);
    });
  });
});

server.listen(process.env.PORT || 3030);
