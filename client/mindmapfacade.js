var util = require('./util'),
EventEmitter = require('events').EventEmitter;

function MindmapFacade(mindmap) {
	this.mindmap = mindmap;
	EventEmitter.call(this);
};

util.inherits(MindmapFacade, EventEmitter);

MindmapFacade.prototype.createBubble = function(options) {
	var self = this, bubble,
		connectedBubbleId;
	
	console.log(options);

	if (this.mindmap.selectedBubble) {
		connectedBubbleId = this.mindmap.selectedBubble.id;
	}

	this.emit('bubble-added', {
		connectedBubbleId: connectedBubbleId,
		bubble: options
	})

	return bubble;
};

MindmapFacade.prototype.deleteSelection = function() {
	this.mindmap.deleteSelection();
};

MindmapFacade.prototype.connectBubbles = function(bubble1, bubble2) {
	this.mindmap.connectBubbles(bubble1, bubble2);
	this.emit('connection', {
		first: bubble1,
		second: bubble2
	});
};

module.exports = MindmapFacade;

