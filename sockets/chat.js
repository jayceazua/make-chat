module.exports = (io, socket) => {
  // Listen for 'new user' socket emits
  socket.on('new user', (username) => {
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
};