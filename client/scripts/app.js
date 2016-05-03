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
    this.fetch();
  }
  send(message) {
    $.ajax({
      url: this.server,
      type: 'POST',
      data: JSON.stringify(message),
      contentType: 'application/json',
      success: (data) => {
        console.log('chatterbox: Message sent');
        $('#message').val('');
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
        this.messages = data.results;
        this.fetchMessages();
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
    var messageString = `<div><p><span class='username'>${message.username}</span>: ${message.text}</p></div>`;
    this.loadMessages(messageString);
    this.send(message);
  }
  fetchMessages() {
    var newMessages = '';
    this.messages.forEach(message => {
      newMessages = `<div><p><span class='username'>${message.username}</span>: ${message.text}</p></div>${newMessages}`;
    });
    this.loadMessages(newMessages);
  }
  loadMessages(messages) {
    var $newMessages = $(filterXSS(messages));
    // var $newMessages = $(messages);
    $('#chats').append($newMessages);
    $newMessages.find('.username').click( () => { this.addFriend(message.username); });
    $('.chat-window').animate({scrollTop: $('.chat-window')[0].scrollHeight }, 1000);
  }
  addRoom(room) {
    var filteredRoom = filterXSS(room);
    $('#roomSelect').append(`<option value="${filteredRoom}">${filteredRoom}</option>`);
  }
  addFriend(username) {
    this.friends[username] = username;
  }
  handleSubmit() {
    var username = filterXSS(window.location.search.split('=')[1]);
    // var message = filterXSS($('#message').val());
    var message = $('#message').val();
    var room = $('#roomSelect').val();

    this.addMessage({
      username: username,
      text: message,
      roomname: room
    });
  } 
}


var app = new App();
app.init();
