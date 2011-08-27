var EventEmitter = require('events').EventEmitter;

function Pipe(mindmap) {
	this.mindmap = mindmap;

};

Pipe.prototype.wireUp = function() {
	var mindmap = this.mindmap;
	now.receiveMoveEvent = function(name, bubble) {
		if (name === now.name) return;

		moveBubble(bubble.id, bubble.x, bubble.y);
	};

	now.receiveBubbleAdded = function(name, bubble) {
		if (name === now.naleme) return;
		console.log(bubble.id);
		console.log(bubble.x);
		console.log(bubble.y);
		console.log(bubble.text);

		mindmap.createBubble({id:bubble.id, x:bubble.x, y:bubble.y, text:bubble.text});
	};

	now.receiveBubbleConnection = function(name,id1,id2){
		var bubble1 = mindmap.getBubble(id1);
		var bubble2 = mindmap.getBubble(id2);

		mindmap.connectBubbles(ide1,ide2);
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
		text: data.bubble.label
	});

	data.bubble.on('drag', broadcastMove);
}

function fireConnection(data) {
	now.bubbleConnection(data.first.id, data.second.id);
}

function broadcastMove(data) {
	now.moveBubble({
		id: this.ellipse.id,
		x: data.x,
		y: data.y
	});
}

function moveBubble(id, x, y) {
	var bubble = this.mindmap.getBubble(id);

	bubble.move(x, y);
}

module.exports = Pipe;

