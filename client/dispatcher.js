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
			connectedBubbleId: data.connectedBubbleId,
			id: data.bubble.id,
			x: data.bubble.x,
			y: data.bubble.y,
			text: data.bubble.label
		});
	});

	EventEmitter.call(this);
};

util.inherits(Dispatcher, EventEmitter);

Dispatcher.prototype.addListener = function(bubble) {
	bubble.on('drag', function(data) {
		now.bubbleMoveBroadcast({
			id: bubble.id,
			x: data.x,
			y: data.y
		});
	});

	bubble.on('destroy', function(data) {
		now.bubbleDestroyedBroadcast({
			id: bubble.id
		});
	});

	bubble.on('label-changed', function(data) {
		now.bubbleLabelChangedBroadcast({
			id: bubble.id,
			newText: data.newText
		});
	});
}

function broadcastBubbleConnection(data) {
	now.bubbleConnectionBroadcast(data.first.id, data.second.id);
}

module.exports = Dispatcher;

