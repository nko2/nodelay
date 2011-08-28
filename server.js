var express = require('express'),
	nko = require('nko')('LkbXCCkD9H9HndHX'),
	path = require('path'),
	nowjs = require('now'),
	eyes = require('eyes'),
	_ = require('underscore'),
	browserify = require('browserify'),
	crypto = require('crypto'),
	MindmapProvider = require('./lib/mindmap-provider'),
	server, mindmapProvider;

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
			'user': path.join(__dirname, 'client/user'),
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
			}
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

		console.log('mindmap exists : ' + exists);
		eyes.inspect(mindmaps);

		if (exists) {
			req.flash('error', 'A mindmap with that name already exists, ' +
									'try another one');
			res.redirect('/');
		}
		else {
			console.log('mindmaps: ' + mindmaps);
			provider.add({
				name: req.body.mindmapname
			});
			res.redirect('/mindmap/' + req.body.mindmapname);
		}
	});		
});
server.listen(8080);

var everyone = nowjs.initialize(server);

nowjs.on('connect', function() {
	var self = this;
	this.now.mindmap = 'monkey';

	nowjs.getGroup(this.now.mindmap).addUser(this.user.clientId);
	nowjs.getGroup(this.now.mindmap).now.userConnected(this.now.name);
	console.log(this.now.name + ' joined: ' + this.now.mindmap);
	
	mindmapProvider.get(this.now.mindmap, function(err, mindmap) {
		var bubble, connection;
		
		eyes.inspect(mindmap);

		for (bubble in mindmap.bubbles) {
			console.log('sending bubble: %j', bubble);
			nowjs.getGroup(self.now.mindmap).now.receiveBubbleAdded(self.now.name, bubble);
		}
		
		for(connection in mindmap.connections) {
			console.log('sending connection: %j', connection);
			nowjs.getGroup(self.now.mindmap).now.receiveBubbleConnection('SERVER', { first: connection.first, second: connection.second });
		}
	});
});

nowjs.on('disconnect', function() {
	nowjs.getGroup(this.now.room).removeUser(this.user.clientId);
	nowjs.getGroup(this.now.mindmap).now.userDisconnected(this.now.name);
	console.log('left: ' + this.now.name);
});

everyone.now.bubbleMoveBroadcast = function(bubble) {
	eyes.inspect(bubble);
	nowjs.getGroup(this.now.mindmap).now.receiveBubbleMove(this.now.name, bubble);
};

everyone.now.bubbleAddedBroadcast = function(bubble) {
	var self = this;
	console.log('about to add bubble: %j', bubble);
	mindmapProvider.addBubble(this.now.mindmap, bubble, function(err, result) {
		var connection = { first: bubble.connectedBubbleId, second: bubble.id };
		
		console.log('about to add connection: %j', connection);
		mindmapProvider.addConnection(self.now.mindmap, connection, function(err, result) {
			if (err) {
				console.info("Couldn't persist something :(")
			} else {
				console.info('Persisted all the things!');
			}
		});	
	});

	nowjs.getGroup(this.now.mindmap).now.receiveBubbleAdded(this.now.name, bubble);
};

everyone.now.bubbleConnectionBroadcast = function(id1, id2) {
	var connection = { first: id1, second: id2 }
	console.log('about to add connection: %j', connection);
	mindmapProvider.addConnection(this.now.mindmap, connection, function(err, result) {
		eyes.inspect(err);
		eyes.inspect(result);
	});
	nowjs.getGroup(this.now.mindmap).now.receiveBubbleConnection(this.now.name, id1, id2);
};


everyone.now.bubbleDestroyedBroadcast = function(bubble) {
	console.log('about to delete bubble: %j', bubble);
	mindmapProvider.deleteBubble(this.now.mindmap, bubble, function(err, result) {	
		if (err) {
			console.info("Couldn't persist something :(")
		} else {
			console.info('deleted bubble!');
		}
	});

	nowjs.getGroup(this.now.mindmap).now.receiveBubbleDestroyed(this.now.name, bubble.id);
};

everyone.now.bubbleLabelChangedBroadcast = function(id, text) {
	nowjs.getGroup(this.now.mindmap).now.receiveBubbleLabelChanged(this.now.name, id, text);
};

