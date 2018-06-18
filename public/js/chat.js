$(function(){
	var socket = io();
	var m = document.getElementById('m');
	var username = document.getElementById('chat-username');

	$('form').submit(function(){
		socket.emit('chat message', $('#chat-username').text() + ': ' + $('#m').val());
                $('#m').val('');
                return false;
	});
 	socket.on('chat message', function(msg){
		document.getElementById('feedback').innerHTML = '';
		$('#output').append($('<p>').text(msg));
	});

	socket.on('typing', function(data){
		document.getElementById('feedback').innerHTML = '<p><em>' + data + ' is typing a message...</em></p>';
	});

	m.addEventListener('keypress', function(){
		socket.emit('typing', $('#chat-username').text());
	});
});
