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
		userreceiver = require('./user-receiver'),
		Dispatcher = require('./dispatcher'),
		Receiver = require('./receiver'),
		PromptFactory = require('./promptFactory');
	
	userreceiver.setup();
	
	mindmap = new Mindmap(paper);
	mindmapFacade = new MindmapFacade(mindmap);

	welcomeBox = paper.rect(10, 10, 200, 50, 5);
	welcomeText = paper.text(
		welcomeBox.getBBox().x + 100, 
		welcomeBox.getBBox().y + 25, 
		'Double click to start'
	).attr({ fill : '#AECC75', 'font-size': 16 });
	welcomeBox.attr({
		 stroke: '#AECC75', 
		 fill: '#333', 
		 'stroke-width': 3
	});
	
	setTimeout(function() {
		welcomeBox.remove();
		welcomeText.remove();
	}, 5000);

	$("#scene").dblclick(function(evt) {
		var centerY = evt.clientY - (circleHeight / 2),
		newText;
		
		var promptFactory = new PromptFactory()
			promptFactory.create(
				$( "#dialog-form" ),
				"What's the big idea?",
				function(what){
					newText = what;
					mindmapFacade.createBubble({
					x: evt.clientX,
					y: centerY,
					label: newText
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

	userreceiver.setup();
	dispatcher = new Dispatcher(mindmapFacade);
	receiver = new Receiver(mindmap,dispatcher);
	receiver.wireUp();
});

