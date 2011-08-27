function User() {
};


User.prototype.setupUser = function() {	
	now.name = prompt('Who are you', '');

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
