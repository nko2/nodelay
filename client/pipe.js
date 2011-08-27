var EventEmitter = require('events').EventEmitter;

function Pipe(mindmap) {
	this.mindmap = mindmap;

};

Pipe.prototype.wireUp = function() {
	var mindmap = this.mindmap;
	now.receiveMoveEvent = function(name, id, x, y) {
		if (name === now.name) return;
		moveBubble(name, id, x, y);
	};

	now.receiveBubbleAdded = function(name, bubble) {
		if (name === now.name) return;
		console.log(bubble.id);
		console.log(bubble.x);
		console.log(bubble.y);
		console.log(bubble.text);

		mindmap.createBubble(bubble.x, bubble.y, bubble.text);
	};

	this.mindmap.on('bubble-added', added);
	this.mindmap.on('connection', fireConnection);
};

function added(data) {
	console.log(data);
	now.bubbleAddedBroadcast({
		id: data.bubble.id, 
		x: data.bubble.x, 
		y: data.bubble.y, 
		text: data.bubble.text
	});

	data.bubble.on('drag', broadcastMove);
}

function fireConnection(data) {
	now.bubbleConnection(data.first.id, data.second.id);
}

function broadcastMove(data) {
	now.moveBubble(this.ellipse.id, data.x, data.y);
}

function moveBubble(name, id, x, y) {
	var bubble = this.mindmap.getBubble(id);

	bubble.move(x, y);
}

module.exports = Pipe;

