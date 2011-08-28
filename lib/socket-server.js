var nowjs = require('now'),
	eyes = require('eyes'),
	idCounter = 0,
	MindmapProvider = require('./mindmap-provider'),
	mindmapProvider = new MindmapProvider();

function SocketServer(httpServer) {
	this.httpServer = httpServer;
}

SocketServer.prototype.initialize = function () {
	var everyone = nowjs.initialize(this.httpServer);

	nowjs.on('connect', function() {
		var self = this;
		this.now.mindmap = '';

		console.log(this.now.name + ' connected');
	});

	nowjs.on('disconnect', function() {
		nowjs.getGroup(this.now.mindmap).removeUser(this.user.clientId);
		nowjs.getGroup(this.now.mindmap).now.userDisconnected(this.now.name);
		console.log(this.now.name + ' disconnected');
	});
	
	everyone.now.joinMindmap = function(mindmapName) {
		console.log(this.user.clientId + ' joined ' + mindmapName);
		nowjs.getGroup(mindmapName).addUser(this.user.clientId);
		this.now.mindmap = mindmapName;
		
		nowjs.getGroup(this.now.mindmap).now.userConnected(this.now.name);
		
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
	};

	everyone.now.bubbleMoveBroadcast = function(bubble) {
		eyes.inspect(bubble);
		nowjs.getGroup(this.now.mindmap).now.receiveBubbleMove(this.now.name, bubble);
	};

	everyone.now.bubbleAddedBroadcast = function(bubble) {
		var self = this;
		bubble.id = ++idCounter;
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
};

module.exports = SocketServer;
