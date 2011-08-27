var express = require('express'),
nko = require('nko')('LkbXCCkD9H9HndHX'),
path = require('path'),
nowjs = require('now'),
browserify = require('browserify'),
server;

server = express.createServer();

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

server.listen(8080);

console.log('Running on 8080');

