var EventEmitter = require('events').EventEmitter;

function Pipe(mindmap) {
	this.mindmap = mindmap;

};

Pipe.prototype.wireUp = function(){
	now.receiveMoveEvent = function(name, id, x, y) {
		if (name === now.name) return;

		var bubble = this.mindmap.getBubble(id);

		bubble.move(x, y);
	};
};


module.exports = Pipe;

