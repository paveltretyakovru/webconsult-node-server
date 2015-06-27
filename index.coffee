app 	= require('http').createServer()
io 		= require('socket.io')(app)
chat 	= require('chat')

app.listen 1337

io.on 'connection' , (socket) ->
	Chat = new chat()
	console.log 'New socket connection' , Chat.clients


	test = ->
		console.log 'addClient function'

	socket.on 'addClient' , (data) ->

		test()




console.log 'Server running at http://127.0.0.1:1337/'