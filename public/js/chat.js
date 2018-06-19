$(function(){
	var socket = io();
	var m = document.getElementById('message');
	var username = document.getElementById('chat-username');

	socket.on('connect', function(){
		socket.emit('adduser', $('#chat-username').text());
	});

	$('form').submit(function(){
		socket.emit('chat message', $('#chat-username').text() + ': ' + $('#message').val());
                $('#message').val('');
                return false;
	});

	m.addEventListener('keypress', function(){
		socket.emit('typing', $('#chat-username').text());
	});

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
