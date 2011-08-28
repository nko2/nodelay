$(function() {

	var width = 1024,
	height = 768,
	circleWidth = width / 10,
	circleHeight = height / 10,
	paper = Raphael(document.getElementById("scene"), width, height),
	mindmap,
	bubble1,
	bubble2,
	Mindmap = require('./mindmap'),
	MindmapFacade = require('./mindmapfacade'),
	mindmapFacade,
	User = require('./user'),
	user = new User(),
	Dispatcher = require('./dispatcher'),
	Receiver = require('./receiver'),
	PromptFactory = require('./promptFactory');
	
	user.setupUser();
	mindmap = new Mindmap(paper);
	mindmapFacade = new MindmapFacade(mindmap);

	bubble1 = mindmapFacade.createBubble({
		x: 100,
		y: 100,
		text: "Example Bubble1"
	});

	bubble2 = mindmapFacade.createBubble({
		x: 300,
		y: 300,
		text: "Example Bubble2"
	});

	$("#scene").dblclick(function(evt) {
		var centerY = evt.clientY - (circleHeight / 2),
		newText;
		
		var promptFactory = new PromptFactory()
			promptFactory.create(
				$( "#dialog-form" ),
				"What's the big idea?",
				function(what){
					newText = what;
					console.log('new Text : '+newText);
					mindmapFacade.createBubble({
					x: evt.clientX,
					y: centerY,
					text: newText
				});
			});
	});

	if ($.browser.mozilla) {
		$(document).keypress(function(evt) {
			if (evt.keyCode == 46) {
				mindmapFacade.deleteSelection();
			}
		});
	} else {
		$(document).keydown(function(evt) {
			if (evt.keyCode == 46) {
				mindmapFacade.deleteSelection();
			}
		});
	}

	dispatcher = new Dispatcher(mindmapFacade);
	dispatcher.addListener(bubble1);
	dispatcher.addListener(bubble2);

	receiver = new Receiver(mindmap);
	receiver.wireUp();

});

