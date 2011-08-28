var express = require('express'),
	nko = require('nko')('LkbXCCkD9H9HndHX'),
	path = require('path'),
	eyes = require('eyes'),
	_ = require('underscore'),
	browserify = require('browserify'),
	crypto = require('crypto'),
	MindmapProvider = require('./lib/mindmap-provider'),
	SocketServer = require('./lib/socket-server'),
	server, socketServer, mindmapProvider;

process.addListener('uncaughtException', function (err, stack) {
	console.log('Caught exception: ' + err + '\n' + err.stack);
});

mindmapProvider = new MindmapProvider();
server = express.createServer();

server.configure(function configureAppAndMiddleware() {
	server.set('view engine', 'jade');
	server.set('view', path.join(__dirname, 'views'));

	server.use(express.bodyParser());
	server.use(express.cookieParser());
	server.use(express.session({ secret: 'LkbXCCkD9H9HndHX' }));
	server.use(express.static(path.join(__dirname, 'public')));
	server.use(browserify({
		require: {
			'index': path.join(__dirname, 'client/index'),
			'util': path.join(__dirname, 'client/util'),
			'mindmap': path.join(__dirname, 'client/mindmap'),
			'bubble': path.join(__dirname, 'client/bubble'),
			'dispatcher': path.join(__dirname, 'client/dispatcher'),
			'receiver': path.join(__dirname, 'client/receiver'),
			'user-receiver': path.join(__dirname, 'client/user-receiver'),
			'promptFactory': path.join(__dirname, 'client/promptFactory'),
		}
	}));
});

server.get('/', function showHomePage(req, res) {
	var mindmaps;
	
	mindmapProvider.all(function(err, mindmaps) {
		res.render('index.jade', {
			locals: {
				flash: req.flash(),
				mindmaps: mindmaps
			},
			layout : 'index-layout.jade'
		});	
	});
});

server.get('/mindmap/:name', function(req, res) {
	res.render('workspace.jade');
});

server.post('/create', function(req, res) {
	var provider = mindmapProvider;
	
	mindmapProvider.all(function(err, mindmaps) {
		var response = res,
			request = req,
			exists = _.detect(mindmaps, function(mindmap) {
				return mindmap.name == req.body.mindmapname;
			});		

		eyes.inspect(mindmaps);

		if (exists) {
			req.flash('error', 'A mindmap with that name already exists, ' +
									'try another one');
			res.redirect('/');
		}
		else {
			provider.add({
				name: req.body.mindmapname,
				bubbles: [],
				connections: []
			});
			res.redirect('/mindmap/' + req.body.mindmapname);
		}
	});		
});
server.listen(8080);

socketServer = new SocketServer(server);
socketServer.initialize();

