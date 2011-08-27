$(function() {

	var width = 1024,
		height = 768,
		circleWidth = width / 10,
		circleHeight = height / 10,
		paper = Raphael(document.getElementById("scene"), width, height),
		mindmap, Mindmap = require('./mindmap'),
		mindmapFacade, MindmapFacade = require('./mindmapfacade'),
		Pipe = require('./pipe'),
		User = require('./user');

	mindmap = new Mindmap(paper);
	mindmapFacade = new MindmapFacade(mapper); 

	mindmapFacade.createBubble({ x: 100, y: 100, text: "Example Bubble1" });
	mindmapFacade.createBubble({ x: 300, y: 300, text: "Example Bubble2" });

	$("label").inFieldLabels();

	$("#scene").dblclick(function(evt) {
		
		var centerY = evt.clientY - (circleHeight / 2),
			text;
			text = prompt("What's the big idea?", "");
			
		mindmapFacade.createBubble({ x: evt.clientX, y: centerY, text: text });
	});

	user = new User();
	user.setupUser();

	pipe = new Pipe(mindmap);
	pipe.wireUp();
});

