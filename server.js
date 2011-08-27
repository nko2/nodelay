var express = require('express'),
nko = require('nko')('LkbXCCkD9H9HndHX'),
path = require('path'),
nowjs = require('now'),
eyes = require('eyes'),
browserify = require('browserify'),
crypto = require('crypto'),
server;

server = express.createServer();
var rooms = [];

server.configure(function configureAppAndMiddleware() {
	server.set('view engine', 'jade');
	server.set('view', path.join(__dirname, 'views'));

	server.use(express.bodyParser());
	server.use(express.cookieParser());
	server.use(express.static(path.join(__dirname, 'public')));
	server.use(browserify({
		require: {
			'index': path.join(__dirname, 'client/index'),
			'bubble': path.join(__dirname, 'client/bubble')
		}
	}));
});

server.get('/', function showHomePage(req, res) {

	res.render('index.jade', {
		rooms: rooms
	});
});

server.get('/workspace/:name', function(req, res) {
	res.render('workspace.jade');
});

server.post('/create', function(req, res) {
	if (rooms.indexOf(req.body.room) != - 1) {
		var message = 'That room already exists, pick another one';
		res.redirect('/');
	}
	else {
		console.log('rooms: ' + rooms);
		rooms.push({name: req.body.room});
		res.redirect('/workspace/' + req.body.room);
	}
});
server.listen(8080);

console.log('Running on 8080');

var everyone = nowjs.initialize(server);
nowjs.on('connect', function() {
	everyone.now.connectionMessage(this.now.name, " has joined the room");
	console.log('joined: ' + this.now.name);
})

nowjs.on('disconnect', function() {
	everyone.now.connectionMessage(this.now.name, " has left the room");
	console.log('left: ' + this.now.name);
})

nowjs.on('add', function() {
	console.log('add: ' + this.now.message);
})

