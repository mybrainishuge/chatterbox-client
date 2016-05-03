// YOUR CODE HERE:


class App {
  constructor() {
    this.friends = {};
    this.server = 'https://api.parse.com/1/classes/messages';
    this.messages = [];
  }
  init() {
    $('#send').unbind('submit').bind('submit', (e) => {
      e.preventDefault();
      this.handleSubmit();
    });
  }
  send(message) {
    $.ajax({
      url: this.server,
      type: 'POST',
      data: JSON.stringify(message),
      contentType: 'application/json',
      success: (data) => {
        console.log('chatterbox: Message sent');
      },
      error: (data) => {
        console.error('chatterbox: Failed to send message', data);
      }
    });
  }
  fetch() {
    $.ajax({
      url: this.server,
      type: 'GET',
      contentType: 'application/json',
      success: (data) => {
        console.log('Data', data);
        this.messages = data.results;
        this.loadMessages();
      },
      error: (data) => {
        console.error('chatterbox: Failed to send message', data);
      }
    });
  }
  clearMessages() {
    $('#chats').html('');
  }
  addMessage(message) {
    var $newMessage = $(`<div><p><span class='username'>${message.username}</span>: ${message.text}</p></div>`);
    $('#chats').append($newMessage);
    $newMessage.find('.username').click( () => { this.addFriend(message.username); });
    $('.chat-window').animate({scrollTop: $('.chat-window').height() }, 300);
  }
  addRoom(room) {
    $('#roomSelect').append(`<option value="${room}">${room}</option>`);
  }
  addFriend(username) {
    this.friends[username] = username;
  }
  handleSubmit() {
    var username = filterXSS(window.location.search.split('=')[1]);
    var message = filterXSS($('#message').val());
    var room = $('#roomSelect').val();
    console.log('once');

    this.addMessage({
      username: username,
      text: message,
      room: room
    });
  }
  loadMessages() {
    var newMessages = '';
    this.messages.forEach(message => {
      newMessages = `<div><p><span class='username'>${message.username}</span>: ${message.text}</p></div>${newMessages}`;
    });
    var $allMessages = $(newMessages);
    $('#chats').append($allMessages);
    $allMessages.find('.username').click( () => { this.addFriend(message.username); });
    $('.chat-window').animate({scrollTop: $('.chat-window').height() }, 300);
  }
}



var app = new App();
app.init();
