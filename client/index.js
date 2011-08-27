$(function() {

	var width = 1024,
	height = 768,
	circleWidth = width / 10,
	circleHeight = height / 10,
	paper = Raphael(document.getElementById("scene"), width, height),
	mindmap,
	Mindmap = require('./mindmap'),
	mindmapFacade,
	MindmapFacade = require('./mindmapfacade'),
	Pipe = require('./pipe'),
	User = require('./user');

	mindmap = new Mindmap(paper);
	mindmapFacade = new MindmapFacade(mindmap);

	mindmapFacade.createBubble({
		x: 100,
		y: 100,
		text: "Example Bubble1"
	});

	mindmapFacade.createBubble({
		x: 300,
		y: 300,
		text: "Example Bubble2"
	});

	$("label").inFieldLabels();

	$("#scene").dblclick(function(evt) {
		var centerY = evt.clientY - (circleHeight / 2),
		newText;
		textSetterPrompter(function(buttonValue, message, formValues) {

			newText = formValues.alertName;
			if (newText != "") {
				console.log('hi');
				mmindmapFacade.createBubble({
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

	user = new User();
	user.setupUser();

	pipe = new Pipe(mindmap);
	pipe.wireUp();

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

