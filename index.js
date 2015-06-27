var debug 	= require('debug')('index');
var app 	= require('http').createServer();
var io 		= require('socket.io')(app);
var chat 	= require('chat');

var Chat = new chat(io);

io.on('connection', function(socket) {

	socket.on('addClient', function(data) {
		// Добавляем клиента
		Chat.addClient(socket , data);
		// Добавлеяем в комнату
		socket.join('clients');

		// Отрпавляем количество консультантов онлайн
		return socket.emit('takeCountConsultants' , {count : Chat.issetConsultants()});
	});

	socket.on('addConsultant' , function(data){
		Chat.addConsultant(socket);
		// Добавляем в комнату
		socket.join('consultants');
		// Отравлем пользователям что подключился новый консультант
		return io.emit('takeCountConsultants' , {count : Chat.issetConsultants()});
	});

	socket.on('takeOfflineTask' , function(data){
		return Chat.takeOfflineTask(data , socket);
	});

	socket.on('disconnect' , function(){
		Chat.removeConnection(socket);
		return io.emit('takeCountConsultants' , {count : Chat.issetConsultants()});
	})

});

debug('Запущен сервер http://127.0.0.1:1337/');

app.listen(1337);