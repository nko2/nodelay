var express = require('express'),
	nko = require('nko')('LkbXCCkD9H9HndHX'),
	path = require('path'),
	nowjs = require('now'),
	eyes = require('eyes'),
	_ = require('underscore'),
	browserify = require('browserify'),
	crypto = require('crypto'),
	MindmapManager = require('./lib/mindmap-manager'),
	server, mindmapManager;

mindmapManager = new MindmapManager();
server = express.createServer();

server.configure(function configureAppAndMiddleware() {
	server.set('view engine', 'jade');
	server.set('view', path.join(__dirname, 'views'));

	server.use(express.bodyParser());
	server.use(express.cookieParser());
	server.use(express.static(path.join(__dirname, 'public')));
	server.use(browserify({
		require: {
			'index': path.join(__dirname, 'client/index'),
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
	var mindmaps;
	
	mindmapManager.all(function(err, mindmaps) {
		res.render('index.jade', {
			mindmaps: mindmaps
		});	
	});
});

server.get('/mindmap/:name', function(req, res) {
	res.render('workspace.jade');
});

server.post('/create', function(req, res) {
	var mgr = mindmapManager;
	
	mindmapManager.all(function(err, mindmaps) {
		var response = res,
			request = req,
			exists = _.detect(mindmaps, function(mindmap) {
				return mindmap.name == req.body.mindmapname;
			});		

		console.log('mindmap exists : ' + exists);
		eyes.inspect(mindmaps);

		if (exists) {
			var message = 'A mindmap with that name already exists, try ' +
							'another one';
			res.redirect('/');
		}
		else {
			console.log('mindmaps: ' + mindmaps);
			mgr.add({
				name: req.body.mindmapname
			});
			res.redirect('/mindmap/' + req.body.mindmapname);
		}
	});		
});
server.listen(8080);

var everyone = nowjs.initialize(server);
nowjs.on('connect', function() {
	this.now.mindmap = 'monkey';
	nowjs.getGroup(this.now.mindmap).addUser(this.user.clientId);

	everyone.now.connection(this.now.name, " has joined the mindmap");
	console.log('joined: ' + this.now.id);
})

nowjs.on('disconnect', function() {
	everyone.now.disconnection(this.now.name, " has left the mindmap");
	console.log('left: ' + this.now.name);
})

everyone.now.bubbleMoveBroadcast = function(bubble) {
	eyes.inspect(bubble);
	nowjs.getGroup(this.now.mindmap).now.receiveBubbleMove(this.now.name, bubble);
};

everyone.now.bubbleAddedBroadcast = function(bubble) {
	nowjs.getGroup(this.now.mindmap).now.receiveBubbleAdded(this.now.name, bubble);
};
everyone.now.bubbleConnectionBroadcast = function(id1, id2) {
	nowjs.getGroup(this.now.mindmap).now.receiveBubbleConnection(this.now.name, id1, id2);
};


everyone.now.bubbleDestroyedBroadcast = function(id) {
	nowjs.getGroup(this.now.mindmap).now.receiveBubbleDestroyed(this.now.name, id);
};

everyone.now.bubbleLabelChangedBroadcast = function(id, text) {
	nowjs.getGroup(this.now.mindmap).now.receiveBubbleLabelChanged(this.now.name, id, text);
};

