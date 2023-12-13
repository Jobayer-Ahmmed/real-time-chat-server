const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const mongoose = require('mongoose');
const env = require("dotenv").config()

const app = express();
const server = http.createServer(app);
const io = socketIo(server);
const port = process.env.PORT || 5000


const uri =  `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.3j47jpb.mongodb.net/?retryWrites=true&w=majority`


mongoose.connect(uri);

const Message = mongoose.model('Message', {
  user: String,
  content: String,
});

io.on('connection', (socket) => {
  console.log('a user connected');

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });

  socket.on('chat message', (msg) => {
    const message = new Message(msg);
    message.save().then(() => {
      io.emit('chat message', msg);
    });
  });
});

server.listen(port, () => {
  console.log(`the port is ${port} running`);
});
