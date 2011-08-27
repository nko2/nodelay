var util = require('./util'), 
	EventEmitter = require('events').EventEmitter,
	idCounter = 0;

function Bubble(paper) {
	this.paper = paper;
	this.defaultBubbleAttributes = {
		 stroke: '#AECC75', 
		 fill: '#333', 
		 'stroke-width': 5
	};
	this.defaultWidth = 70;
	this.defaultHeight = 50;
	this.id = ++idCounter;
	EventEmitter.call(this);
}

util.inherits(Bubble, EventEmitter);

Bubble.prototype.draw = function(x, y) {
	this.ellipse = this.paper.ellipse(x, y, this.defaultWidth, this.defaultHeight);
	this.ellipse.attr(this.defaultBubbleAttributes);
	this.addTextToBubble('I AM A BUBBLE!');
	this.emit('new');
};

Bubble.prototype.select = function() {
	this.ellipse.animate({ stroke: '#fff' }, 100);
	this.emit('selected');
};

Bubble.prototype.deselect = function() {
	this.ellipse.animate({ stroke: '#AECC75' }, 100);
	this.emit('deselected');
};

Bubble.prototype.addTextToBubble = function (bubbleText) {
	this.text = this.paper.text(
			this.ellipse.getBBox().x + this.defaultWidth / 2, 
			this.ellipse.getBBox().y + this.defaultHeight / 2, 
			bubbleText
		).attr({fill : '#AECC75'});
	//associate the shapes with each other.
	this.ellipse.pair = this.text;
	this.text.pair = this.ellipse;
};

module.exports = Bubble;
