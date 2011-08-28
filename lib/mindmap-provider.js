var mongo = require('mongodb');

var MindmapProvider = function() {
	this.db = new mongo.Db('Mindmappr', 
		new mongo.Server('staff.mongohq.com', 10067, {}), 
		{ native_parser: false });
};

MindmapProvider.prototype.getMindmapsCollection = function(callback) {
	var self = this;

	this.db.open(function databaseOpen(err, db) {
		var cb = callback,
			that = self;

		if (err) {
			console.error('ERROR CONNECTING: %j', err);
		}

		db.authenticate('nodelay', 'goatbubbles', function authenticated(err, result) {
			var database = db;

			if (err) {
				console.error('ERROR AUTHENTICATING: %j', err);
			}
			
			console.log('Authenticated to mongohq');	
			db.collection('Mindmaps', function mindmapCollection(err, collection) {
				var callback = cb;

				if (err) {
					console.error('ERROR ACCESSING MINDMAPS: %j', err);
				}

				cb(err, collection, db);
			});
		});
	});
};

MindmapProvider.prototype.all = function(callback) {
	var self = this;

	this.getMindmapsCollection(function mindmapCollection(err, collection) {
		var cb = callback;
		if (err) {
			console.error('ERROR ACCESSING MINDMAPS: %j', err);
		}

		function mindmapsFoundCallback(err, result) {
			if (err) {
				console.error('ERROR GETTING MINDMAPS: %j', err);
			} else {
				console.info('successfully got mindmaps from mongo');
			}

			self.db.close();
			cb(err, result);
		}

		collection.find().toArray(mindmapsFoundCallback);
	});
};

MindmapProvider.prototype.deleteBubble = function(mindmapName, bubble, callback) {
	var self = this;

	this.getMindmapsCollection(function mindmapCollection(err, collection) {
		var cb = callback,
			name = mindmapName,
			b = bubble;
		if (err) {
			throw err;
		}

		function bubbleDeletedCallback(err) {
			if (err) {
				console.error('ERROR DELETING BUBBLE: %j', err);
			} else {
				console.info('successfully deleted bubble in mongo');
			}

			self.db.close();
			cb(err);
		}
		
		console.info('UPDATING ' + name + ' deleting bubble %j', b);
		collection.update({ 
				"name": name 
			}, { 
				'$pull': { "bubbles": { id: b.id }}
			}, { 
				safe:true 
			}, bubbleDeletedCallback);
	});
};

MindmapProvider.prototype.get = function(mindmapName, callback) {
	var self = this;

	this.getMindmapsCollection(function mindmapCollection(err, collection) {
		var cb = callback,
			name = mindmapName;
		if (err) {
			throw err;
		}

		function mindmapFoundCallback(err, result) {
			if (err) {
				console.error(err);
			} else {
				console.info('successfully got mindmap from mongo');
			}

			self.db.close();
			cb(err, result);
		}

		collection.find({ name: name }).toArray(mindmapFoundCallback);
	});
};


MindmapProvider.prototype.updateBubble = function(mindmapName, bubble, callback) {
	var self = this;

	this.getMindmapsCollection(function mindmapCollection(err, collection) {
		var cb = callback,
			name = mindmapName,
			b = bubble;
		if (err) {
			throw err;
		}

		function bubbleUpdatedCallback(err) {
			if (err) {
				console.error('ERROR ADDING BUBBLE: %j', err);
			} else {
				console.info('successfully updated mindmap bubble in mongo');
			}

			self.db.close();
			cb(err);
		}

		console.info('UPDATING ' + name + ' bubble %j', b);
		collection.find({ name: name }).toArray(function(err, mindmap) {
			var bubbleToUpdate = b;
			console.log('Found the mindmap to update: %j', mindmap);
			mindmap[0].bubbles.forEach(function(bubble) {
				if (bubble.id = bubbleToUpdate.id) {
					bubble.x = bubbleToUpdate.x;
					bubble.y = bubbleToUpdate.y;
					bubble.text = bubbleToUpdate.text;
				}
			});

			collection.save(mindmap, cb);
		});
	});
};

MindmapProvider.prototype.addBubble = function(mindmapName, bubble, callback) {
	var self = this;

	this.getMindmapsCollection(function mindmapCollection(err, collection) {
		var cb = callback,
			name = mindmapName,
			b = bubble;
		if (err) {
			throw err;
		}

		function bubbleAddedCallback(err) {
			if (err) {
				console.error('ERROR ADDING BUBBLE: %j', err);
			} else {
				console.info('successfully added bubble to mindmap in mongo');
			}

			self.db.close();
			cb(err);
		}

		console.info('UPDATING ' + name + ' adding bubble %j', b);
		collection.update({ 
				"name": name 
			}, { 
				'$push': { "bubbles": b } 
			}, { 
				safe:true 
			}, bubbleAddedCallback);
	});
};

MindmapProvider.prototype.addConnection = function(mindmapName, connection, callback) {
	var self = this;

	this.getMindmapsCollection(function mindmapCollection(err, collection) {
		var cb = callback,
			name = mindmapName,
			c = connection;

		if (err) {
			throw err;
		}

		function connectionAddedCallback(err) {
			if (err) {
				console.error('ERROR ADDING CONNECTION: %j', err);
			} else {
				console.info('successfully added connection to mindmap in mongo');
			}

			self.db.close();
			cb(err);
		}
		
		console.info('UPDATING ' + name + ' adding connection %j', c);
		collection.update({ 
				"name": name 
			}, { 
				'$push': { "connections": c } 
			}, { 
				safe:true 
			}, connectionAddedCallback);
	});
};

MindmapProvider.prototype.add = function(mindmap) {
	var self = this;

	this.getMindmapsCollection(function mindmapCollection(err, collection) {
		if (err) {
			throw err;
		}

		function mindmapAddedCallback(err, result) {
			if (err) {
				console.error('ERROR ADDING MINDMAP: %j', err);
			} else {
				console.info('successfully added mindmap to mongo');
			}
			
			self.db.close();
		}

		collection.insert(mindmap, mindmapAddedCallback);
	});
};

module.exports = MindmapProvider;
