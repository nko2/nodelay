function User() {
};


User.prototype.setupUser = function() {	
	//now.name = prompt('Who are you', '');
	
	textSetterPrompter(function(buttonValue, message, formValues) {

			newText = formValues.alertName;
			if (now.name != "") {
				mindmapFacade.createBubble({
					x: evt.clientX,
					y: centerY,
					text: now.name
				});
				return true;
			}
			message.children('#idea-text').css("border", "solid #ff0000 1px");
			return false;
		});
		
	function textSetterPrompter(callback) {
		var txt = 'Who are you ?:<br /><input type="text" id="idea-text" name="alertName"/>';

		$.prompt(txt, {
			callback: callback,
			buttons: {
				OK: true,
				Cancel: false
			},
			closeOnEscape: false,
			open: function(event, ui) { $(".ui-dialog-titlebar-close").hide(); }
		});
	}

	function slugify(name) {
		return name.replace(' ', '-');
	}

	now.connection = function(name, message) {
		$("#messages").append($("<li>").attr('id', slugify(name)).text(name));
	};

	now.disconnection = function(name, message) {
		$('#' + slugify(name)).remove();
	};

};

module.exports = User;
