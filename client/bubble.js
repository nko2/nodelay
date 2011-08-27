var util = require('./util'), 
	EventEmitter = require('events').EventEmitter,
	idCounter = 0;

// Options
// - paper
// - x
// - y
// - id
function Bubble(options) {
	this.paper = options.paper;
	this.defaultBubbleAttributes = {
		 stroke: '#AECC75', 
		 fill: '#333', 
		 'stroke-width': 5
	};
	this.defaultWidth = 70;
	this.defaultHeight = 50;
	this.startX = options.x;
	this.startY = options.y;
	this.id = options.id || ++idCounter;
	EventEmitter.call(this);
}

util.inherits(Bubble, EventEmitter);

Bubble.prototype.draw = function(text) {
	var self = this;
	
	this.ellipse = this.paper.ellipse(this.startX, this.startY, this.defaultWidth, this.defaultHeight);
	this.ellipse.attr(this.defaultBubbleAttributes);
	this.addTextToBubble(text);
	this.emit('new');
	
	function dragger() {
		this.ox = this.type == "ellipse" ? this.attr("cx") : this.attr("x");
		this.oy = this.type == "ellipse" ? this.attr("cy") : this.attr("y");
		if (this.type != "text") this.animate({"fill-opacity": .2}, 500);

		// Original coords for pair element
		this.pair.ox = this.pair.type == "ellipse" ? this.pair.attr("cx") : this.pair.attr("x");
		this.pair.oy = this.pair.type == "ellipse" ? this.pair.attr("cy") : this.pair.attr("y");
		if (this.pair.type != "text") this.pair.animate({"fill-opacity": .2}, 500);

	}

	function move(dx, dy) {
		// Move main element
		var toX = this.ox + dx,
			toY = this.oy + dy;

		self.move(toX, toY);
		self.emit('drag', { x: toX, y: toY});
		self.paper.safari();
	}

	function up() {
		self.emit('drag-end');
	}	
	
	this.ellipse.drag(move, dragger, up);
	this.text.drag(move, dragger, up);	
};

Bubble.prototype.move = function (toX, toY) {
	var pairAttributes,
		attributes = { cx: toX, cy: toY };	

	this.ellipse.attr(attributes);

	// Move text
	pairAttributes = { x: toX, y: toY };
	this.ellipse.pair.attr(pairAttributes);
	self.emit('move', { x: toX, y: toY});
};

Bubble.prototype.select = function() {
	this.ellipse.animate({ stroke: '#fff' }, 100);
	this.emit('selected');
};

Bubble.prototype.deselect = function() {
	this.ellipse.animate({ stroke: '#AECC75' }, 100);
	this.emit('deselected');
};

Bubble.prototype.destroy = function() {
	this.ellipse.remove();
	this.text.remove();
	this.emit('destroyed');
};

Bubble.prototype.addTextToBubble = function (bubbleText) {
	var self = this;
	this.text = this.paper.text(
			this.ellipse.getBBox().x + this.defaultWidth, 
			this.ellipse.getBBox().y + this.defaultHeight, 
			bubbleText
		).attr({ fill : '#AECC75', 'font-size': 14 });
		
	//associate the shapes with each other.
	this.ellipse.pair = this.text;
	this.text.pair = this.ellipse;


	this.text.click(function() {
		var newText = prompt('Enter new text:');
		self.text.attr('text', newText);
		self.emit('label-changed', { newText: newText });
	});
};

module.exports = Bubble;
