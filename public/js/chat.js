$(function(){
	var socket = io();
	var m = document.getElementById('message');
	var username = document.getElementById('chat-username');

	/** When a user clicks the 'SEND' button **/

	$('form').submit(function(){
		socket.emit('chat message', $('#chat-username').text() + ': ' + $('#message').val());
                $('#message').val('');
                return false;
	});

	/** When a user presses a key while in the '#message' input field **/

	m.addEventListener('keypress', function(){
		socket.emit('typing', $('#chat-username').text());
	});

	/** When a user connects **/

	socket.on('connect', function(){
		socket.emit('adduser', $('#chat-username').text());
	});
	
	/** Listen for events from the back end **/

 	socket.on('chat message', function(msg){
		document.getElementById('feedback').innerHTML = '';
		$('#output').append($('<p>').text(msg));
	});

	socket.on('typing', function(data){
		document.getElementById('feedback').innerHTML = '<p><em>' + data + ' is typing a message...</em></p>';
	});

	socket.on('updateusers', function(data) {
		$('#users').empty();
		$.each(data, function(key, value) {
			$('#users').append('<li class="list-group-item">' + key + '</li>');
		});
	});

});
