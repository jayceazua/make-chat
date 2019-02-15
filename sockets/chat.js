module.exports = (io, socket, onlineUsers) => {
  // Listen for 'new user' socket emits
  socket.on('new user', (username) => {
    // save the username as key to access the user's socket id
    onlineUsers[username] = socket.Id;
    // save the username to socket as well. this is important for later.
    socket["username"] = username;
    console.log(`${username} has joined the chat room.`);
    //Send the username to all clients currently connected
    io.emit('new user', username);
  });

  // listen for new messages
  socket.on('new message', (data) => {
    // send that data back to all clients
    console.log(`${data.sender}: ${data.message}`);
    io.emit('new message', data);
  });

  socket.on('get online users', () => {
    //send over the onlineusers
    socket.emit('get online users', onlineUsers);
  });
  // this fires when a user closes out of the application
  socket.on('disconnect', () => {
    // this deletes the user by using the username we saved to the socket
    delete onlineUsers[socket.username]
    io.emit('user has left', onlineUsers);
  });
  socket.on('new channel', (newChannel) => { 
    console.log(newChannel);
  })
};