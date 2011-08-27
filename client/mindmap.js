function Mindmap(paper) {
	this.paper = paper;
	this.connections = [];
	this.bubbles = [];
	this.defaultBubbleAttributes = {
		 stroke: '#AECC75', 
		 fill: '#333', 
		 'stroke-width': 5
	};
	this.defaultWidth = 70;
	this.defaultHeight = 50;
};


Mindmap.prototype.createBubble = function(x, y) {
	var bubble = this.paper.ellipse(x, y, this.defaultWidth, this.defaultHeight);
	bubble.attr(this.defaultBubbleAttributes);
	this.addTextToBubble(bubble);

	this.bubbles.push(bubble);
	return bubble;
};

Mindmap.prototype.connectBubbles = function(bubble1, bubble2) {
	var connection = this.paper.connection(bubble1, bubble2, '#AECC75', '#AECC75');
	this.connections.push(connection);
	return connection;
};

Mindmap.prototype.addTextToBubble = function (bubble) {
	var bubbleText = this.paper.text(
			bubble.getBBox().x + this.defaultWidth/2, 
			bubble.getBBox().y+ this.defaultHeight/2, 
			"idea1"
		).attr({fill : '#AECC75'});
	bubble.text = bubbleText;
	console.log(bubble);
};

module.exports = Mindmap;
