var express = require('express'),
nko = require('nko')('LkbXCCkD9H9HndHX'),
path = require('path'),
nowjs = require('now'),
eyes = require('eyes'),
_ = require('underscore'),
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
			'workspace': path.join(__dirname, 'client/workspace'),
			'util': path.join(__dirname, 'client/util'),
			'mindmap': path.join(__dirname, 'client/mindmap'),
			'bubble': path.join(__dirname, 'client/bubble'),
			'dispatcher': path.join(__dirname, 'client/dispatcher'),
			'receiver': path.join(__dirname, 'client/receiver'),
			'user': path.join(__dirname, 'client/user')
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
	var exists = _.detect(rooms, function(room) {
		return room.name == req.body.room;
	});
	console.log('room exists : ' + exists);
	eyes.inspect(rooms);
	if (exists) {
		var message = 'That room already exists, pick another one';
		res.redirect('/');
	}
	else {
		console.log('rooms: ' + rooms);
		rooms.push({
			name: req.body.roomll
		});
		res.redirect('/workspace/' + req.body.room);
	}
});
server.listen(process.env.PORT || 8080);

var everyone = nowjs.initialize(server);
nowjs.on('connect', function() {
	this.now.room = 'monkey';
	nowjs.getGroup(this.now.room).addUser(this.user.clientId);

	everyone.now.connection(this.now.name, " has joined the room");
	console.log('joined: ' + this.now.id);
})

nowjs.on('disconnect', function() {
	everyone.now.disconnection(this.now.name, " has left the room");
	console.log('left: ' + this.now.name);
})

everyone.now.bubbleMoveBroadcast = function(bubble) {
	eyes.inspect(bubble);
	nowjs.getGroup(this.now.room).now.receiveBubbleMove(this.now.name, bubble);
};

everyone.now.bubbleAddedBroadcast = function(bubble) {
	nowjs.getGroup(this.now.room).now.receiveBubbleAdded(this.now.name, bubble);
};
everyone.now.bubbleConnectionBroadcast = function(id1, id2) {
	nowjs.getGroup(this.now.room).now.receiveBubbleConnection(this.now.name, id1, id2);
};

everyone.now.bubbleDeletedBroadcast = function(id) {
	nowjs.getGroup(this.now.room).now.receiveBubbleDeleted(this.now.name, id);
};

everyone.now.bubbleLabelChangedBroadcast = function(id, text) {
	nowjs.getGroup(this.now.room).now.receiveBubbleLabelChanged(this.now.name, id, text);
};

