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
	Receiver = require('./receiver');

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
		textSetterPrompter(function(buttonValue, message, formValues) {

			newText = formValues.alertName;
			if (newText != "") {
				console.log('hi');
				mindmapFacade.createBubble({
					x: evt.clientX,
					y: centerY,
					text: newText
				});
				return true;
			}
			message.children('#idea-text').css("border", "solid #ff0000 1px");
			return false;
		});
	});
	
	$(document).keypress(function(evt) {
		if (evt.keyCode == 46) {
			console.log('DELETE');
			mindmapFacade.deleteSelection();
		}
	});



	dispatcher = new Dispatcher(mindmapFacade);
	console.log(bubble2);
	dispatcher.AddListener(bubble1);
	dispatcher.AddListener(bubble2);

	receiver = new Receiver(mindmap);
	receiver.wireUp();
	
	function textSetterPrompter(callback) {
		var txt = 'What \'s the big idea ?:<br /><input type="text" id="idea-text" name="alertName"/>';

		$.prompt(txt, {
			callback: callback,
			buttons: {
				OK: true,
				Cancel: false
			}
		});
	}

});

