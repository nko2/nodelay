//this class should take care of evets from outside and telling the
//ui to update
function Receiver(mindmap) {
	this.mindmap = mindmap;
};

Receiver.prototype.wireUp = function() {
	now.receiveBubbleMove = function(name, bubble) {
		if (name === now.name) return;

		console.log('bubble move:' + bubble);

		var bubble = this.mindmap.getBubble(bubble.id);
		bubble.move(bubble.x, bubble.y);
	};

	now.receiveBubbleAdded = function(name, bubble) {
		if (name === now.name) return;

		console.log('bubble added:' + bubble);

		this.mindmap.createBubble({
			id: bubble.id,
			x: bubble.x,
			y: bubble.y,
			text: bubble.text
		});
	};

	now.receiveBubbleConnection = function(name, id1, id2) {
		if (name === now.name) return;
		console.log('bubble connection:' + id1 + " with " + id2);
		var bubble1 = this.mindmap.getBubble(id1);
		var bubble2 = this.mindmap.getBubble(id2);

		this.mindmap.connectBubbles(id1, id2);
	};
};

module.exports = Receiver;

