var EventEmitter = require('events').EventEmitter;
// the dispatcher dispatches mindmap change events arround to the rest of the world,
// or whatever

function Dispatcher(mindmapFacade) {
	this.mindmapFacade = mindmapFacade;

	this.mindmapFacade.on('bubble-added', broadcastBubbleAdded);
	this.mindmapFacade.on('connection', broadcastBubbleConnection);
};

Dispatcher.prototype.AddListener = function(bubble) {
	bubble.on('drag', broadcastMove);
};

function broadcastBubbleAdded(data) {
	now.bubbleAddedBroadcast({
		id: data.bubble.id,
		x: data.bubble.x,
		y: data.bubble.y,
		text: data.bubble.label
	});
	AddListener(data.bubble);
}

function broadcastBubbleConnection(data) {
	now.bubbleConnection(data.first.id, data.second.id);
}

function broadcastMove(data) {
	now.moveBubble({
		id: this.ellipse.id,
		x: data.x,
		y: data.y
	});
}

module.exports = Dispatcher;
