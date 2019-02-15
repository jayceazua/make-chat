// index.js
$(document).ready(() => {
  const socket = io.connect();

  $('#createUserBtn').click((e) => {
    e.preventDefault();
    let username = $('#usernameInput').val();
    if (username.length > 0) {
      //Emit to the server the new user
      socket.emit('new user', username);
      $('.usernameForm').remove();
      // have the main page visible
      $('.mainContainer').css('display', 'flex');
    }
  });

  // socket listeners
  socket.on('new user', (username) => {
    console.log(`${username} has joined the chat!`);
    // add the new user to the online users div
    $('.usersOnline').append(`<div class="userOnline">${username}</div>`);
  })

})