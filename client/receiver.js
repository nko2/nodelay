//this class should take care of evets from outside and telling the
//ui to update
function Receiver(mindmap) {
	this.mindmap = mindmap;
};

Receiver.prototype.wireUp = function() {
	var self = this;

	now.receiveBubbleMove = function(name, movement) {
		if (name === now.name) return;

		var bubble = self.mindmap.getBubble(movement.id);

		bubble.move(movement.x, movement.y);
	};

	now.receiveBubbleAdded = function(name, bubble) {
		if (name === now.name) return;

		self.mindmap.createBubble({
			connectedBubbleId: bubble.connectedBubbleId,
			id: bubble.id,
			x: bubble.x,
			y: bubble.y,
			text: bubble.text
		});
	};

	now.receiveBubbleConnection = function(name, id1, id2) {
		if (name === now.name) return;
		var bubble1 = self.mindmap.getBubble(id1);
		var bubble2 = self.mindmap.getBubble(id2);

		self.mindmap.connectBubbles(id1, id2);
	};

	now.receiveBubbleDestroyed = function(name, id) {
		if (name === now.name) return;
		var bubble = self.mindmap.getBubble(id);
		self.mindmap.deleteBubble(bubble);
	};
	
	now.receiveBubbleLabelChanged = function(name, data) {
		if (name === now.name) return;
		var bubble = self.mindmap.getBubble(data.id);
		self.mindmap.changeLabel(bubble,data.newText);
	};
};

module.exports = Receiver;

