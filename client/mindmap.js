var Bubble = require('./bubble');

function Mindmap(paper) {
	this.paper = paper;
	this.connections = [];
	this.bubbles = [];
};


Mindmap.prototype.createBubble = function(x, y) {
	var self = this,
		bubble = new Bubble(this.paper);

	function dragger() {
		this.ox = this.attr("cx");
		this.oy = this.attr("cy");
		this.animate({
			"fill-opacity": .2
		},
		500);
	}

	function move(dx, dy) {
		var att = {
			cx: this.ox + dx,
			cy: this.oy + dy
		};
		this.attr(att);
		for (var i = self.connections.length; i--;) {
			self.paper.connection(self.connections[i]);
		}
		self.paper.safari();
	}

	function up() {
		self.selectedBubble = bubble;
		this.animate({
			"fill-opacity": 0
		},
		500);
	}
		
	bubble.draw(x, y);
	bubble.ellipse.drag(move, dragger, up);
		
	this.bubbles.push(bubble);
	
	// Only connect the bubbles if this is not the first bubble
	if (this.selectedBubble) {
		this.connectBubbles(this.selectedBubble, bubble);
	}
	this.selectedBubble = bubble;
	
	return bubble;
};

Mindmap.prototype.connectBubbles = function(bubble1, bubble2) {
	var connection = this.paper.connection(bubble1.ellipse, bubble2.ellipse, '#AECC75', '#AECC75');
	this.connections.push(connection);
	return connection;
};

module.exports = Mindmap;
