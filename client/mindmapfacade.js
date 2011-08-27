var util = require('./util'),
EventEmitter = require('events').EventEmitter;

function MindmapFacade(mindmap) {
	this.mindmap = mindmap;
	EventEmitter.call(this);
};

util.inherits(MindmapFacade, EventEmitter);

MindmapFacade.prototype.createBubble = function(options) {
	var self = this,
	var bubble = this.mindMap.createBubble(options);
	bubble.on('drag-end', function updateSelection() {
		self.changeSelection(this);
	});

	this.emit('bubble-added', {
		bubble: bubble
	});

};

MindmapFacade.prototype.connectBubbles = function(bubble1, bubble2) {
	this.mindMap.connectBubbles(bubble1, bubble2);
	this.emit('connection', {
		first: bubble1,
		second: bubble2
	});
};

module.exports = MindmapFacade;

