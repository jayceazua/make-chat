//Make sure to add channels to module.exports parameters
module.exports = (io, socket, onlineUsers, channels) => {
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
    //Save the new message to the channel.
    channels[data.channel].push({
      sender: data.sender,
      message: data.message
    });
    //Emit only to sockets that are in that channel room.
    io.to(data.channel).emit('new message', data);
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
  });
  socket.on('new channel', (newChannel) => {
    //Save the new channel to our channels object. The array will hold the messages.
    channels[newChannel] = [];
    //Have the socket join the new channel room.
    socket.join(newChannel);
    //Inform all clients of the new channel.
    io.emit('new channel', newChannel);
    socket.join(newChannel);
    //Emit to the client that made the new channel, to change their channel to the one they made.
    socket.emit('user changed channel', {
      channel: newChannel,
      messages: channels[newChannel]
    });
  });
  
};