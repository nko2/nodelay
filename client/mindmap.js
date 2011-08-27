var util = require('./util'),
	EventEmitter = require('events').EventEmitter,
	Bubble = require('./bubble');

function Mindmap(paper) {
	this.paper = paper;
	this.connections = [];
	this.bubbles = [];
	EventEmitter.call(this);
};

util.inherits(Mindmap, EventEmitter);


Mindmap.prototype.createBubble = function(x, y) {
	var self = this,
		bubble = new Bubble(this.paper);
	
	bubble.on('drag', function updateConnections(data) {
		for (var i = self.connections.length; i--;) {
			self.paper.connection(self.connections[i]);
		}
	});
	
	bubble.on('drag-end', function updateSelection() {
		self.changeSelection(this);
	});
		
	bubble.draw(x, y);
		
	this.bubbles.push(bubble);
	
	// Only connect the bubbles if this is not the first bubble
	if (this.selectedBubble) {
		this.connectBubbles(this.selectedBubble, bubble);
	}
	this.changeSelection(bubble);
};

Mindmap.prototype.changeSelection = function(newSelection) {
	if (this.selectedBubble) {
		this.selectedBubble.deselect();
	}
	this.selectedBubble = newSelection;
	newSelection.select();
	this.emit('selection-changed');
};

Mindmap.prototype.connectBubbles = function(bubble1, bubble2) {
	var connection = this.paper.connection(bubble1.ellipse, bubble2.ellipse, '#AECC75', '#AECC75');
	this.connections.push(connection);
	return connection;
};

module.exports = Mindmap;
