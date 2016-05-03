// YOUR CODE HERE:
class App {
  constructor() {
    this.friends = {};
    this.server = 'https://api.parse.com/1/classes/messages';
    this.messages = [];
    this.lastUpdated = null;
    this.rooms = {};
  }

  // Initialize application
  init() {
    $('#send').unbind('click').bind('click', (e) => {
      e.preventDefault();
      this.handleSubmit();
    });
    $('#roomSelect').unbind('change').bind('change', (e) => {
      e.preventDefault();
      this.clearMessages();
    });
    $('#add-room').unbind('click').bind('click', (e) => {
      e.preventDefault();
      var $newRoom = $('#room-name').val();
      this.addRoom($newRoom);
      $('#roomSelect').val($newRoom);
      $('#room-name').val('');
      this.clearMessages();
    });
    setInterval(this.fetch.bind(this), 1000);
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
    this.lastUpdated = null;
  }

  // Add a new message to chat window and send to server
  addMessage(message) {
    this.fetch();
    this.send(message);
    $('.chat-window').animate({scrollTop: $('.chat-window')[0].scrollHeight }, 1000);
  }

  // Builds html elements to load fetched messages into chat window
  fetchMessages() {
    var newMessages = '';
    for ( var i = 0; i < this.messages.length; i++) {
      if ( this.messages[i].objectId === this.lastUpdated) {
        i = this.messages.length;
      } else if ( this.messages[i].username && this.messages[i].text && this.messages[i].roomname ) {
        if (this.messages[i].roomname === $('#roomSelect').val() || $('#roomSelect').val() === 'abyss') {
          var cssClass = 'username';
          if ( this.friends[this.messages[i].username] ) {
            cssClass += ' text-bold';
          }
          newMessages = `<div><p><span class='${cssClass}' data-username="${filterXSS(this.messages[i].username)}">${filterXSS(this.messages[i].username)}</span>: ${filterXSS(this.messages[i].text)}</p></div>${newMessages}`;
        }
        if (!this.rooms.hasOwnProperty(this.messages[i].roomname)) {
          this.addRoom(this.messages[i].roomname);
        }
      }
    }
    this.lastUpdated = this.messages[0].objectId;
    this.loadMessages(newMessages);
  }

  // Load messages onto the chat window
  loadMessages(messages) {
    var $newMessages = $(messages);
    
    $newMessages.find('.username').on( 'click', (event) => { 
      var clickedUsername = $(event.currentTarget).attr('data-username');
      this.addFriend(clickedUsername); 
      $(`.username[data-username="${clickedUsername}"`).addClass('text-bold');
    });
    var atBottom = $('.chat-window').scrollTop() + 500 === $('.chat-window')[0].scrollHeight;
    $('#chats').append($newMessages); 
    if ( $newMessages.length && atBottom) {
      $('.chat-window').animate({scrollTop: $('.chat-window')[0].scrollHeight }, 1000);
    }
    // var friendMessages = $('.username').filter( (element) => {
    //   return this.friends.hasOwnProperty(element.attr('data-username'));
    // });
    // friendMessages.addClass('text-bold');
  }

  // Add a new room
  addRoom(room) {
    var filteredRoom = filterXSS(room);
    $('#roomSelect').append(`<option value="${filteredRoom}">${filteredRoom}</option>`);
    this.rooms[filteredRoom] = filteredRoom;
  }

  // Add a friend
  addFriend(username) {
    if (!this.friends.hasOwnProperty(username) && username !== window.location.search.split('=')[1].replace(/%20/g, ' ')) {
      this.friends[username] = `<div>${username}</div>`;
      $('.friends-list').append(this.friends[username]);
    }
  }

  // Handle message submission
  handleSubmit() {
    var username = filterXSS(window.location.search.split('=')[1]).replace(/%20/g, ' ');
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
