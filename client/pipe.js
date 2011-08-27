var EventEmitter = require('events').EventEmitter;

function Pipe(mindmap) {
	this.mindmap = mindmap;

};

Pipe.prototype.wireUp = function() {
	now.receiveMoveEvent = function(name, id, x, y) {
		if (name === now.name) return;
		moveBubble(name, id, x, y);
	};

	this.mindmap.on('drag', broadcastMove);
};

function broadcastMove() {
	now.moveEventBroadcast(this.ellipse.id, this.ellipse.x, this.ellipse.y);
}

function moveBubble(name, id, x, y) {
	var bubble = this.mindmap.getBubble(id);

	eyes.inspect(bubble);
	bubble.move(x, y);
}

module.exports = Pipe;

