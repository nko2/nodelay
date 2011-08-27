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
	var self = this;
	
	this.ellipse = this.paper.ellipse(x, y, this.defaultWidth, this.defaultHeight);
	this.ellipse.attr(this.defaultBubbleAttributes);
	this.addTextToBubble('BUBBLE!');
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
			var pairIsEllipse = (this.pair.type === 'ellipse'),
				pairAttributes,
				attributes = !pairIsEllipse ? 
					{ cx: this.ox + dx, cy: this.oy + dy } :
					{ x: this.ox + dx, y: this.oy + dy };

			this.attr(attributes);

			// Move paired element
			pairAttributes = pairIsEllipse ? 
				{ cx: this.pair.ox + dx, cy: this.pair.oy + dy } :
				{ x: this.pair.ox + dx, y: this.pair.oy + dy };

			this.pair.attr(pairAttributes);

			self.emit('drag', pairIsEllipse ? pairAttributes : attributes);
			
			self.paper.safari();
	}

	function up() {
		self.emit('drag-end');
	}	
	
	this.ellipse.drag(move, dragger, up);
	this.text.drag(move, dragger, up);	
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
	var self = this;
	this.text = this.paper.text(
			this.ellipse.getBBox().x+this.defaultWidth, 
			this.ellipse.getBBox().y +this.defaultHeight, 
			bubbleText
		).attr({ fill : '#AECC75', 'font-size': 14 });
		
	//associate the shapes with each other.
	this.ellipse.pair = this.text;
	this.text.pair = this.ellipse;


	this.text.click(function() {
		var newText = prompt('Enter new text:');
		self.text.attr('text', newText);
	});
};

module.exports = Bubble;
