function Mindmap(paper) {
	this.paper = paper;
	this.connections = [];
	this.bubbles = [];
};

Mindmap.prototype.createBubble = function(x, y, width, height) {
	var bubble = this.paper.ellipse(x, y, width, height);
	bubble.attr({ stroke: '#AECC75', fill: '#333', 'stroke-width': 5 });
	this.bubbles.push(bubble);
	return bubble;
};

Mindmap.prototype.connectBubbles = function(bubble1, bubble2) {
	var connection = this.paper.connection(bubble1, bubble2, '#AECC75', '#AECC75');
	this.connections.push(connection);
	return connection;
};

module.exports = Mindmap;
