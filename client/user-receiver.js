var PromptFactory = require('./promptFactory');

userreceiver = {};

userreceiver.setup = function() {
	var promptFactory = new PromptFactory(),
		url = window.location.href,
		mindmapName = url.substr(url.lastIndexOf('/') + 1);
	
	promptFactory.create(
		$( "#dialog-form" ),
		"Who are you?",
		function(what){
			now.name = what;
			now.joinMindmap(mindmapName);
			console.log('now name : ' + now.name);
	});

	console.dir(now);

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
