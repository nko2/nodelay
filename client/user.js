var PromptFactory = require('./promptFactory');

userreceiver = {};

userreceiver.setup = function() {
		$(document).ready(function(){
			var promptFactory = new PromptFactory()
			promptFactory.create(
				$( "#dialog-form" ),
				"Who are you?",
				function(what){
					now.name = what;
					console.log('now name : '+now.name);
			});
			
		});
		

	function slugify(name) {
		return name.replace(' ', '-');
	}

	now.userConnected = function(name) {
		if (name) {
			$("#messages").append($("<li>").attr('id', slugify(name)).text(name));
		}
	};

	now.userDisconnected = function(name) {
		if (name) {
			$('#' + slugify(name)).remove();
		}
	};

};

module.exports = userreceiver;
