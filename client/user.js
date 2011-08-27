function User() {
};


User.prototype.setupUser = function() {	
	//now.name = prompt('Who are you', '');
	
	nameSetterPrompter(function(buttonValue, message, formValues) {

			now.name = formValues.alertName;
			if (now.name != "") {
				return true;
			}
			message.children('#idea-text').css("border", "solid #ff0000 1px");
			return false;
		});
		
	function nameSetterPrompter(callback) {
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
		if (name) {
			$("#messages").append($("<li>").attr('id', slugify(name)).text(name));
		}
	};

	now.disconnection = function(name, message) {
		if (name) {
			$('#' + slugify(name)).remove();
		}
	};

};

module.exports = User;
