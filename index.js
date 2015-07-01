var debug 				= require('debug')('index');
var app 				= require('http').createServer();
var io 					= require('socket.io')(app);
var chat 				= require('chat');
var backbone_storage	= require('BackboneStorage');

var Storage = new backbone_storage();
var Chat = new chat(io , Storage);

io.on('connection', function(socket) {

	socket.on('addClient', function(data) {
		debug('добавляем клиента');
		// Добавляем клиента
		Chat.addClient(socket , data);
		// Добавлеяем в комнату
		socket.join('clients');

		// Отрпавляем количество консультантов онлайн
		return socket.emit('takeCountConsultants' , {count : Chat.issetConsultants()});
	});

	socket.on('addConsultant' , function(data){
		Chat.addConsultant(socket , data);
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
	});
	
	// Прослушки для синхронизации с backbone
	socket.on('create', function (data) {
        Storage.create(socket, data.signature);
    });      
    socket.on('read', function (data) {
        Storage.read(socket, data.signature);
    });  
    socket.on('update', function (data) {
        Storage.update(socket, data.signature);       
    }); 
    socket.on('delete', function (data) {
        Storage.destroy(socket, data.signature);       
    });

});

debug('Запущен сервер http://127.0.0.1:1337/ ' + process.env.PORT + ' ' + process.env.IP);

app.listen(process.env.PORT);