function User() {
		
};

User.prototype.setupUser = function() {	
	now.name = prompt('Who are you', '')

	now.connectionMessage = function(name, message) {
		$("#messages").append("<br>" + name + ": " + message)
	}

};

module.exports = User;
