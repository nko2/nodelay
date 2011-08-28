var nowjs = require('now'),
	eyes = require('eyes'),
	idCounter = 0,
	MindmapProvider = require('./mindmap-provider'),
	mindmapProvider = new MindmapProvider();

function SocketServer(httpServer) {
	this.httpServer = httpServer;
}

// Taken from Remy Sharp's blog: 
// http://remysharp.com/2010/07/21/throttling-function-calls/
function throttle(fn, delay) {
	var timer = null;
	return function () {
		var context = this, args = arguments;
		clearTimeout(timer);
		timer = setTimeout(function () {
		fn.apply(context, args);
	}, delay);
};
}

SocketServer.prototype.initialize = function () {
	var everyone = nowjs.initialize(this.httpServer);

	nowjs.on('connect', function() {
		var self = this;
		this.now.mindmap = '';

		console.log('new connection');
	});

	nowjs.on('disconnect', function() {
		nowjs.getGroup(this.now.mindmap).removeUser(this.user.clientId);
		nowjs.getGroup(this.now.mindmap).now.userDisconnected(this.now.name);
		console.log('disconnection');
	});
	
	everyone.now.joinMindmap = function(mindmapName) {
		var self = this;
	
		console.log(this.user.clientId + ' joined ' + mindmapName);
		nowjs.getGroup(mindmapName).addUser(this.user.clientId);
		this.now.mindmap = mindmapName;
		
		// TODO: send all the users to the user that just joined
		nowjs.getGroup(this.now.mindmap).now.userConnected(this.now.name);
		
		mindmapProvider.get(this.now.mindmap, function(err, mindmap) {
			eyes.inspect(mindmap);

			mindmap[0].bubbles.forEach(function(bubble) {
				console.log('sending bubble: %j', bubble);
				nowjs.getGroup(self.now.mindmap).now.receiveBubbleAdded(self.now.name, bubble);
			});
		
			mindmap[0].connections.forEach(function(connection) {
				console.log('sending connection: %j', connection);
				nowjs.getGroup(self.now.mindmap).now.receiveBubbleConnection('SERVER', { first: connection.first, second: connection.second });
			});
		});		
	};
	
	var throttledUpdate = throttle(function(mindmapName, bubbleToUpdate) {
		mindmapProvider.updateBubble(mindmapName, bubbleToUpdate, function(err, result) {	
			if (err) {
				console.info("Couldn't update the bubble :(")
			} else {
				console.info('Updated the bubble!');
			}
		});
	}, 1000);

	everyone.now.bubbleMoveBroadcast = function(bubble) {
		console.log(this.now.mindmap + ': A bubble was moved: %j', bubble);

		throttledUpdate(this.now.mindmap, bubble);
		nowjs.getGroup(this.now.mindmap).now.receiveBubbleMove(this.now.name, bubble);
	};

	everyone.now.bubbleAddedBroadcast = function(bubble) {
		console.log(this.now.mindmap + ': A bubble was added %j', bubble);
		var self = this;
		bubble.id = process.pid + '' + new Date().getTime() + '' + ++idCounter + '';
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
		console.log(this.now.mindmap + ': A connection was made between: %s and %s', id1, id2);
		var connection = { first: id1, second: id2 }
		console.log('about to add connection: %j', connection);
		mindmapProvider.addConnection(this.now.mindmap, connection, function(err, result) {
			if (err) {
				console.info("Couldn't add the connection :(")
			} else {
				console.error('Added the connection!');
			}
		});
		nowjs.getGroup(this.now.mindmap).now.receiveBubbleConnection(this.now.name, id1, id2);
	};


	everyone.now.bubbleDestroyedBroadcast = function(bubble) {
		console.log(this.now.mindmap + ': A bubble was deleted bubble: %j', bubble);
		mindmapProvider.deleteBubble(this.now.mindmap, bubble, function(err, result) {	
			if (err) {
				console.info("Couldn't delete the bubble :(")
			} else {
				console.info('Deleted the bubble!');
			}
		});

		nowjs.getGroup(this.now.mindmap).now.receiveBubbleDestroyed(this.now.name, bubble.id);
	};

	everyone.now.bubbleLabelChangedBroadcast = function(bubble) {
		console.log(this.now.mindmap + ': A label was changed: %j', bubble);
		mindmapProvider.updateBubble(this.now.mindmap, bubble, function(err, result) {	
			if (err) {
				console.info("Couldn't update the bubble :(")
			} else {
				console.info('Updated the bubble!');
			}
		});
		nowjs.getGroup(this.now.mindmap).now.receiveBubbleLabelChanged(this.now.name, bubble);
	};
};

module.exports = SocketServer;
