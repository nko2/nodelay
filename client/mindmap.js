var util = require('./util'),
EventEmitter = require('events').EventEmitter,
Bubble = require('./bubble'),
_ = require('underscore');

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

	function dragger() {
		this.ox = this.type == "ellipse" ? this.attr("cx") : this.attr("x");
		this.oy = this.type == "ellipse" ? this.attr("cy") : this.attr("y");
		if (this.type != "text") this.animate({
			"fill-opacity": .2
		},
		500);

		// Original coords for pair element
		this.pair.ox = this.pair.type == "ellipse" ? this.pair.attr("cx") : this.pair.attr("x");
		this.pair.oy = this.pair.type == "ellipse" ? this.pair.attr("cy") : this.pair.attr("y");
		if (this.pair.type != "text") this.pair.animate({
			"fill-opacity": .2
		},
		500);

	}

	function move(dx, dy) {
		// Move main element
		var att = this.type == "ellipse" ? {
			cx: this.ox + dx,
			cy: this.oy + dy
		}: {
			x: this.ox + dx,
			y: this.oy + dy
		};
		this.attr(att);

		// Move paired element
		att = this.pair.type == "ellipse" ? {
			cx: this.pair.ox + dx,
			cy: this.pair.oy + dy
		}: {
			x: this.pair.ox + dx,
			y: this.pair.oy + dy
		};
		this.pair.attr(att);

		// Move connections
		for (var i = self.connections.length; i--;) {
			self.paper.connection(self.connections[i]);
		}
		self.paper.safari();

		now.moveEventBroadcast(this.id,this.x,this.y);
	}

	function up() {
		self.changeSelection(bubble);
	}

	bubble.draw(x, y);
	bubble.ellipse.drag(move, dragger, up);
	bubble.text.drag(move, dragger, up);

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

Mindmap.prototype.getBubble = function(id) {
	return _.first(_.select(bubles, function(bubble) {
		return bubble.ellipse.id === id
	}));
};

module.exports = Mindmap;

