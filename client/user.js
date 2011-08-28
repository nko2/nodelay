var PromptFactory = require('./promptFactory');

function User() {

		
};



User.prototype.setupUser = function() {	
	$(document).ready(function(){
			var namePrompt = new PromptFactory();
			namePrompt.create($( "#dialog-form" ),"Who are you?",now.name);
			console.log('NOW.Name= '+ now.name);
		});


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
