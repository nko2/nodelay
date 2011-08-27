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
			newText;

			textSetterPrompter(function(buttonValue, message, formValues){

				newText =formValues.alertName;
				if (newText != ""){
				console.log('hi');
					mindmap.createBubble(evt.clientX, centerY, newText);
					return true;
				}
				message.children('#idea-text').css("border","solid #ff0000 1px");
				return false;
		});
	});

	user = new User();
	user.setupUser();

	pipe = new Pipe(mindmap);
	pipe.wireUp();
	
	function textSetterPrompter(callback) {
		var txt = 'What \'s the big idea ?:<br /><input type="text" id="idea-text" name="alertName"/>';
		

		$.prompt(txt,{
			callback: callback,
			buttons: { OK: true, Cancel : false}
		});
	}
	
});

