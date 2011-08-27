//this class shoudl take care of evets from outside and telling the
//ui to updae
function Receiver(mindmap, mindmapFacade) {
	this.mindmapFacade = mindmapFacade;
	
	now.receiveMoveEvent = function(name, bubble) {
		if (name === now.name) return;

		moveBubble(bubble.id, bubble.x, bubble.y);
	};

	now.receiveBubbleAdded = function(name, bubble) {
		if (name === now.naleme) return;

		mindmap.createBubble({id:bubble.id, x:bubble.x, y:bubble.y, text:bubble.text});
	};

	now.receiveBubbleConnection = function(name,id1,id2){
		var bubble1 = mindmap.getBubble(id1);
		var bubble2 = mindmap.getBubble(id2);

		mindmap.connectBubbles(id1,id2);
	};
};

function moveBubble(id, x, y) {
	var bubble = this.mindmap.getBubble(id);

	bubble.move(x, y);
}

module.exports = Pipe;

