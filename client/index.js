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
	
	mindmap.createBubble(100, 100, "Example Bubble1");
	mindmap.createBubble(300, 300, "Exapmple Bubble2");

	$("label").inFieldLabels();

	$("#scene").dblclick(function(evt) {
		
		var centerY = evt.clientY - (circleHeight / 2),
			text;
			text = prompt("What's the big idea?", "");
			
		mindmap.createBubble(evt.clientX, centerY, text);
	});

	user = new User();
	user.setupUser();

	pipe = new Pipe(mindmap);
	pipe.wireUp();
});

