var debug 	= require('debug')('index');
var app 	= require('http').createServer();
var io 		= require('socket.io')(app);
var chat 	= require('chat');

var Chat = new chat(io);

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
        create(socket, data.signature);       
    });      
    socket.on('read', function (data) {
        read(socket, data.signature);
    });  
    socket.on('update', function (data) {
        update(socket, data.signature);       
    }); 
    socket.on('delete', function (data) {
        destroy(socket, data.signature);       
    });

});

debug('Запущен сервер http://127.0.0.1:1337/ ' + process.env.PORT + ' ' + process.env.IP);

app.listen(process.env.PORT);

// Создаем методы для синхронизации с сервером
var create = function (socket, signature) {
    var e = event('create', signature), data = [];
    socket.emit(e, {id : 1});            
};
 
var read = function (socket, signature) {
    var e = event('read', signature), data;
    data.push({})
    socket.emit(e, data);            
};
 
var update = function (socket, signature) {
    var e = event('update', signature), data = [];
    socket.emit(e, {success : true});            
};
 
var destroy = function (socket, signature) {
    var e = event('delete', signature), data = [];
    socket.emit(e, {success : true});            
};
 
// creates the event to push to listening clients
var event = function (operation, sig) {
    var e = operation + ':'; 
    e += sig.endPoint;
    if (sig.ctx) e += (':' + sig.ctx);
 
    return e;
};
