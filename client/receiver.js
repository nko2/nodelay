//this class should take care of evets from outside and telling the
//ui to update
function Receiver(mindmap) {
	this.mindmap = mindmap;
};

Receiver.prototype.wireUp = function() {
	var self = this;

	now.receiveBubbleMove = function(name, movement) {
		if (name === now.name) return;

		console.log(movement);

		var bubble = self.mindmap.getBubble(movement.id);

		console.log(bubble);
		bubble.move(movement.x, movement.y);
	};

	now.receiveBubbleAdded = function(name, bubble) {
		if (name === now.name) return;

		console.log('bubble added:' + bubble);

		self.mindmap.createBubble({
			id: bubble.id,
			x: bubble.x,
			y: bubble.y,
			text: bubble.text
		});
	};

	now.receiveBubbleConnection = function(name, id1, id2) {
		if (name === now.name) return;
		console.log('bubble connection:' + id1 + " with " + id2);
		var bubble1 = self.mindmap.getBubble(id1);
		var bubble2 = self.mindmap.getBubble(id2);

		self.mindmap.connectBubbles(id1, id2);
	};
};

module.exports = Receiver;
