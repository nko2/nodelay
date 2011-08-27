var util = require('./util'),
	EventEmitter = require('events').EventEmitter,
	_ = require('underscore'),
	Bubble = require('./bubble');

function Mindmap(paper) {
	this.paper = paper;
	this.connections = [];
	this.bubbles = [];
	EventEmitter.call(this);
};

util.inherits(Mindmap, EventEmitter);

// Options;
// - x {Number}
// - y {Number}
// - text {String}
// - id {Number}
Mindmap.prototype.createBubble = function(options) {
	var self = this,
	bubble = new Bubble({
		paper: this.paper,
		x: options.x,
		y: options.y,
		id: options.id
	});

	bubble.on('drag', function updateConnections(data) {
		for (var i = self.connections.length; i--;) {
			self.paper.connection(self.connections[i]);
		}
	});

	bubble.on('drag-end', function updateSelection() {
		self.changeSelection(this);
	});

	this.bubbles.push(bubble);
	bubble.draw(options.text);

	bubble.x = options.x;
	bubble.y = options.y;
	bubble.label = options.text;

	// Only connect the bubbles if this is not the first bubble
	if (this.selectedBubble) {
		this.connectBubbles(this.selectedBubble, bubble);
	}

	this.changeSelection(bubble);

	return bubble;
};

Mindmap.prototype.deleteSelection = function() {
	this.deleteBubble(this.selectedBubble);
};

Mindmap.prototype.deleteBubble = function(bubble) {
	var idx = bubbles.indexOf(bubble);
	bubbles.slice(idx, 1);

	bubble.destroy();
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
	var connection = this.paper.connection(bubble1.ellipse, 
			bubble2.ellipse, '#AECC75', '#AECC75');
	this.connections.push(connection);
	this.emit('connection', {
		first: bubble1,
		second: bubble2
	});
};

Mindmap.prototype.getBubble = function(id) {
	var self = this;
	return _.first(_.select(self.bubbles, function(bubble) {
		return bubble.ellipse.id === id
	}));
};


Mindmap.prototype.getNextBubbleId = function(){
	return bubbles.length;
};

module.exports = Mindmap;

