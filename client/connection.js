var util = require('./util'),
	_ = require('underscore'),
	idCounter = 0,
	EventEmitter = require('events').EventEmitter;

// Options
// - paper
// - first {Bubble}
// - second {Bubble}
function Connection(options) {
	this.paper = options.paper;
	this.first = options.first;
	this.second = options.second;
	this.id = ++idCounter || options.id;
	EventEmitter.call(this);
	
	this.first.on('destroy', _.bind(this.destroy, this));
	this.second.on('destroy', _.bind(this.destroy, this));
}

util.inherits(Connection, EventEmitter);

Connection.prototype.connect = function() {
	console.log('Creating connection (%s) between bubbles: %s and %s', 
				this.id, this.first.id, this.second.id);
	this.connection = this.paper.connection(this.first.ellipse, 
			this.second.ellipse, '#AECC75', '#AECC75');			
	this.emit('new');
};

Connection.prototype.redraw = function() {
	this.paper.connection(this.connection);
};

Connection.prototype.destroy = function() {
	console.log(this.connection);
	this.connection.line.remove();
	this.connection.bg.remove();
	this.connection = null;
	this.emit('destroy');
};

module.exports = Connection;
