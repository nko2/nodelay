function Pipe(){	
	now.name = prompt('Who are you', '')

	now.connectionMessage = function(name, message) {
		$("#message").append("<br>" + name + ": " + message)
	}

};

module.exports = Pipe
