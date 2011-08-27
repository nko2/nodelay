function Bubble(paper) {
	this.paper = paper;
	this.connections = [];
};

Bubble.prototype.create = function(x, y, width, height) {
	var bubble = this.paper.ellipse(x, y, width, height);
	bubble.attr({ stroke: '#AECC75', fill: '#333', 'stroke-width': 5 });
	return bubble;
};

Bubble.prototype.connect = function(bubble1, bubble2) {
	var connection = this.paper.connection(bubble1, bubble2, '#AECC75', '#AECC75');
	this.connections.push(connection);
	return connection;
};

module.exports = Bubble;
