$(function() {

	var width = 1024,
		height = 768,
		circleWidth = width / 10,
		circleHeight = height / 10,
		pipes,
		paper = Raphael(document.getElementById("scene"), width, height),
		mindmap,
		Mindmap = require('./mindmap'),
		User = require('./user');

	mindmap = new Mindmap(paper);
	
	mindmap.createBubble(100, 100);
	mindmap.createBubble(300, 300);

	$("label").inFieldLabels();

	$("#scene").dblclick(function(evt) {
		var centerY = evt.clientY - (circleHeight / 2);
		console.dir(mindmap.selectedBubble);
		mindmap.createBubble(evt.clientX, centerY);
		console.dir(mindmap.selectedBubble);
	});

	user = new User();
	user.setupUser();
});

