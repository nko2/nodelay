$(function() {

	var width = 1024,
		height = 768,
		circleWidth = width / 10,
		circleHeight = height / 10,
		paper = Raphael(document.getElementById("scene"), width, height),
		mindmap, Mindmap = require('./mindmap'),
		Pipe = require('./pipe'),
		User = require('./user');

	mindmap = new Mindmap(paper);
	
	mindmap.createBubble({ x: 100, y: 100, text: "Example Bubble1", id: 1001 });
	mindmap.createBubble({ x: 300, y: 300, text: "Example Bubble2", id: 1002 });

	$("label").inFieldLabels();

	$("#scene").dblclick(function(evt) {
		
		var centerY = evt.clientY - (circleHeight / 2),
			text;
			text = prompt("What's the big idea?", "");
			
		mindmap.createBubble({ x: evt.clientX, y: centerY, text: text });
	});
	
	$('#scene').keyup(function(evt) {
		console.log('key pressed');
		if (evt.keycode == 46) {
			mindmap.deleteSelection();
		}
	});

	user = new User();
	user.setupUser();

	pipe = new Pipe(mindmap);
	pipe.wireUp();
});

