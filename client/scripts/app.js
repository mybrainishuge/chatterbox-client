// YOUR CODE HERE:
class App {
  constructor() {
    this.friends = {};
    this.server = 'https://api.parse.com/1/classes/messages';
    this.messages = [];
  }

  // Initialize application
  init() {
    $('#send').unbind('submit').bind('submit', (e) => {
      e.preventDefault();
      this.handleSubmit();
    });
    this.fetch();
  }

  // Send message to server
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

  // Fetch messages from server
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

  // Clear messages from chat window
  clearMessages() {
    $('#chats').html('');
  }

  // Add a new message to chat window and send to server
  addMessage(message) {
    var messageString = `<div><p><span class='username'>${filterXSS(message.username)}</span>: ${filterXSS(message.text)}</p></div>`;
    this.loadMessages(messageString);
    this.send(message);
  }

  // Builds html elements to load fetched messages into chat window
  fetchMessages() {
    var newMessages = '';
    this.messages.forEach(message => {
      if( message.username && message.text ){
        newMessages = `<div><p><span class='username' data-username="${filterXSS(message.username)}">${filterXSS(message.username)}</span>: ${filterXSS(message.text)}</p></div>${newMessages}`;
      }
    });
    this.loadMessages(newMessages);
  }

  // Load messages onto the chat window
  loadMessages(messages) {
    var $newMessages = $(messages);
    $('#chats').append($newMessages);
    $newMessages.find('.username').on( 'click', (event) => { console.log($(event.currentTarget).attr('data-username')) });
    if( $('.chat-window').length > 0 ){ // Ensure chat-window exists before scrolling
      $('.chat-window').animate({scrollTop: $('.chat-window')[0].scrollHeight }, 1000);
    }
  }

  // Add a new room
  addRoom(room) {
    var filteredRoom = filterXSS(room);
    $('#roomSelect').append(`<option value="${filteredRoom}">${filteredRoom}</option>`);
  }

  // Add a friend
  addFriend(username) {
    this.friends[username] = username;
    for( var friend in this.friends ){
      console.log(this.friends[friend]);
      $('.friends').append(this.friends[friend]);
    }
  }

  // Handle message submission
  handleSubmit() {
    var username = filterXSS(window.location.search.split('=')[1]);
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
