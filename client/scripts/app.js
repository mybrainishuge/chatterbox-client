class App {
  constructor() {
    this.server = 'https://api.parse.com/1/classes/messages';
    this.friends = {};
    this.rooms = {
      'The Abyss': 'The Abyss'
    };
    this.messages = [];
    this.lastUpdated = null;
  }

  // Initialize application
  init() {
    $('#send').unbind('click').bind('click', (e) => {
      e.preventDefault();
      this.handleSubmit();
    });

    $('#add-room').unbind('click').bind('click', (e) => {
      e.preventDefault();
      var $newRoom = $('#room-name').val();
      this.addRoom($newRoom);
      this.changeRoom($newRoom);
      $('#room-name').val('');
      this.clearMessages();
    });

    $('.rooms-list').mouseenter( () => {
      var currRoom = $('#currentRoom').attr('data-current');
      $(`[data-room="${currRoom}"]`).addClass('text-yellow');
    }).mouseleave( () => {
      var currRoom = $('#currentRoom').attr('data-current');
      $('.rooms-list li').removeClass('text-yellow');
    });

    $(`[data-room="The Abyss"]`).click( () => {
      this.changeRoom('The Abyss');
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
        if (this.messages[i].roomname === $('#currentRoom').attr('data-current') || $('#currentRoom').attr('data-current') === 'The Abyss') {
          var cssClass = 'username';
          if ( this.friends[this.messages[i].username] ) {
            cssClass += ' text-blue';
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
    });
    var atBottom = $('.chat-window').scrollTop() + 500 === $('.chat-window')[0].scrollHeight;
    $('#chats').append($newMessages); 
    if ( $newMessages.length && atBottom) {
      $('.chat-window').animate({scrollTop: $('.chat-window')[0].scrollHeight }, 1000);
    }
  }

  // Add a new room
  addRoom(room) {
    var filteredRoom = filterXSS(room);
    $('#roomSelect').append(`<li data-room="${filteredRoom}">${filteredRoom}</li>`);
    this.rooms[filteredRoom] = filteredRoom;
    $(`[data-room="${filteredRoom}"]`).click( (event) => {
      this.changeRoom(filteredRoom);
      $('#roomSelect li').removeClass('text-yellow');
      $(event.currentTarget).addClass('text-yellow');
    });
  }

  changeRoom(room) {
    $('#currentRoom').attr('data-current', room).html(room);
    this.clearMessages();
    this.lastUpdated = null;
    this.fetch();
  }

  // Add a friend
  addFriend(username) {
    if (!this.friends.hasOwnProperty(username) && username !== window.location.search.split('=')[1].replace(/%20/g, ' ')) {
      this.friends[username] = $(`<div data-username='${username}'>${username}</div>`);
      $(`.username[data-username="${username}"]`).addClass('text-blue');
      $('.friends-list').append(this.friends[username]);
      this.friends[username].click( (event) => {
        this.removeFriend($(event.currentTarget).attr('data-username'));
      });
    }
  }

  removeFriend(username) {
    $(`.friends-list [data-username="${username}"]`).remove();
    $(`.username[data-username="${username}"]`).removeClass('text-blue');
    delete this.friends[username];
  }

  // Handle message submission
  handleSubmit() {
    var username = filterXSS(window.location.search.split('=')[1]).replace(/%20/g, ' ');
    var message = $('#message').val();
    var room = $('#currentRoom').attr('data-current');

    this.addMessage({
      username: username,
      text: message,
      roomname: room
    });
  } 
}


var app = new App();
app.init();
