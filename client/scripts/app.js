// YOUR CODE HERE:


class App {
  constructor() {
    this.friends = {};
    this.server = 'https://api.parse.com/1/classes/messages';
  }
  init() {
    console.log('clicked');
    $('#send .submit').click( () => {
      console.log('clicked');
      this.handleSubmit();
    });
  }
  send(message) {
    $.ajax({
      url: this.server,
      type: 'POST',
      data: JSON.stringify(message),
      contentType: 'application/json',
      success: function (data) {
        console.log('chatterbox: Message sent');
      },
      error: function (data) {
        console.error('chatterbox: Failed to send message', data);
      }
    });
  }
  fetch() {
    $.ajax({
      url: this.server,
      type: 'GET',
      contentType: 'application/json',
      success: function (data) {
        console.log('chatterbox: Message sent');
      },
      error: function (data) {
        console.error('chatterbox: Failed to send message', data);
      }
    });
  }
  clearMessages() {
    $('#chats').html('');
  }
  addMessage(message) {
    var $newMessage = $(`<div><p><span class='username'>${message.username}</span>: ${message.text}</p></div>`);
    $('#chats').prepend($newMessage);
    $newMessage.find('.username').click( () => { this.addFriend(message.username); });
  }
  addRoom(room) {
    $('#roomSelect').append(`<option value="${room}">${room}</option>`);
  }
  addFriend(username) {
    this.friends[username] = username;
  }
  handleSubmit() {
    var username = window.location.search.split('=')[1];
    var message = $('#message').val();
    var room = $('#roomSelect').val();

    this.addMessage({
      username: username,
      text: message,
      room: room
    });
  }
}



var app = new App();
app.init();
