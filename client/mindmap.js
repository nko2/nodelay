var util = require('./util'),
	EventEmitter = require('events').EventEmitter,
	idCounter = 0,
	_ = require('underscore'),
	Bubble = require('./bubble'),
	Connection = require('./connection');

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
// - connectedBubbleId {Number}
Mindmap.prototype.createBubble = function(options) {
	var self = this,
	bubble = new Bubble({
		paper: this.paper,
		x: options.x,
		y: options.y,
		id: options.id
	});


	bubble.on('move', function updateConnections(data) {
		console.log('handled bubble move');
		for (var i = self.connections.length; i--;) {
			self.connections[i].redraw();
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
	if (options.connectedBubbleId) {
		this.connectBubbles(this.getBubble(options.connectedBubbleId), bubble);
	} else if (this.selectedBubble) {
		this.connectBubbles(this.selectedBubble, bubble);
	}

	this.changeSelection(bubble);

	return bubble;
};

Mindmap.prototype.deleteSelection = function() {
	this.deleteBubble(this.selectedBubble);
};

Mindmap.prototype.deleteBubble = function(bubble) {
	var idx = this.bubbles.indexOf(bubble);
	this.bubbles.slice(idx, 1);

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
	var self = this,
		connection = new Connection({
		paper: this.paper,
		first: bubble1,
		second: bubble2
	});
	connection.connect();

	connection.on('destroy', function() {
		var idx = self.connections.indexOf(connection);
		self.connections.splice(idx, 1);
	});

	this.connections.push(connection);
};


Mindmap.prototype.changeLabel = function(bubble,text){
	bubble.label = text;
	bubble.draw(text);
};

Mindmap.prototype.getBubble = function(id) {
	var self = this;
	return _.first(_.select(self.bubbles, function(bubble) {
		return bubble.id === id
	}));
};


Mindmap.prototype.getNextBubbleId = function(){
	return ++idCounter;
};

module.exports = Mindmap;
