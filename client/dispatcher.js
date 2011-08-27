var util = require('./util'),
EventEmitter = require('events').EventEmitter;

// the dispatcher dispatches mindmap change events arround to the rest of the world,
// or whatever
function Dispatcher(mindmapFacade) {
	this.mindmapFacade = mindmapFacade;
	self = this;

	this.mindmapFacade.on('connection', broadcastBubbleConnection);
	this.mindmapFacade.on('bubble-added', function(data) {
		now.bubbleAddedBroadcast({
			id: data.bubble.id,
			x: data.bubble.x,
			y: data.bubble.y,
			text: data.bubble.label
		});
		self.AddListener(data.bubble);
	});

	EventEmitter.call(this);
};

util.inherits(Dispatcher, EventEmitter);

Dispatcher.prototype.AddListener = function(bubble) {
	bubble.on('drag', broadcastMove);
};

function broadcastBubbleConnection(data) {
	now.bubbleConnection(data.first.id, data.second.id);
}

function broadcastMove(data) {
	now.bubbleMoveBroadcast({
		id: data.id,
		x: data.x,
		y: data.y
	});
}

module.exports = Dispatcher;

