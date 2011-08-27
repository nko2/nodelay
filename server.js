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
		require: path.join(__dirname, 'client/index')
	}));
});

server.get('/', function showHomePage(req, res) {
	res.render('index.jade');
});

server.get('/workspace/:name', function(req, res) {
	console.log(req.params.name);
	res.render('workspace.jade');
});

server.post('/create', function(req, res) {
	if (rooms.indexOf(req.body.room) > 0) {
		res.redirect('/');
	}

	console.log(req.params.room);
	rooms.push(req.params.room);
	res.redirect('/workspace/' + req.body.room);
});
server.listen(8080);

console.log('Running on 8080');

var everyone = nowjs.initialize(server);
nowjs.on('connect', function() {
	console.log('joined: ' + this.now.name);
})

nowjs.on('disconnect', function() {
	console.log('left: ' + this.now.name);
})

nowjs.on('add', function() {
	console.log('add: ' + this.now.message);
})

