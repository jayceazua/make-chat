// index.js
$(document).ready(() => {
  const socket = io.connect();
  // keep track of current user
  let currentUser;
  // get the online users from the server
  socket.emit('get online users');
  $('#createUserBtn').click((e) => {
    e.preventDefault();
    let username = $('#usernameInput').val();
    if (username.length > 0) {
      //Emit to the server the new user
      socket.emit('new user', username);
      // Save the current user when created
      currentUser = username;
      $('.usernameForm').remove();
      // have the main page visible
      $('.mainContainer').css('display', 'flex');
    }
  });

  $('#sendChatBtn').click((e) => {
    e.preventDefault();
    // Get the message text value
    let message = $('#chatInput').val();
    // make sure it's not empty
    if(message.length > 0) {
      // emit the message with the current user to the server
      socket.emit('new message', {
        sender: currentUser,
        message
      });
      $('#chatInput').val("");
    }
  })

  // socket listeners
  socket.on('new user', (username) => {
    console.log(`${username} has joined the chat!`);
    // add the new user to the online users div
    $('.usersOnline').append(`<div class="userOnline">${username}</div>`);
  })

  // output the new message
  socket.on('new message', (data) => {
    $('.messageContainer').append(`
      <div class="message">
        <p class="messageUser">${data.sender}: </p>
        <p class="messageText">${data.message}</p>
      </div>
    `);
  });

  socket.on('get online users', (onlineUsers) => {
    // for (key in obj)
    for (username in onlineUsers) {
      $('.userOnline').append(`<p class="userOnline">${username}</p>`);
    };
  });
  
  //Refresh the online user list
  socket.on('user has left', (onlineUsers) => {
    $('.usersOnline').empty();
    for (username in onlineUsers) {
      $('.usersOnline').append(`<p>${username}</p>`);
    }
  });

  $('#newChannelBtn').click(() => {
    let newChannel = $('#newChannelInput').val();

    if (newChannel.length > 0) {
      // Emit the new channel to the server
      socket.emit('new channel', newChannel);
      $('#newChannelInput').val("");
    }
  })

});