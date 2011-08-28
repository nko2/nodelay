var mongo = require('mongodb');

var MindmapProvider = function() {
	this.db = new mongo.Db('mindmappr', new mongo.Server('localhost', 27017, {}), { native_parser: false });
};

MindmapProvider.prototype.all = function(callback) {
	var self = this;

	this.db.open(function databaseOpen(err, db) {
		var cb = callback;

		console.log('Connected to mongo');
		if (err) {
			throw err;
		}

		db.collection('Mindmaps', function mindmapCollection(err, collection) {
			var callback = cb;
			if (err) {
				throw err;
			}

			console.log('Accessed mindmaps collection');
			function mindmapAddedCallback(err, result) {
				if (err) {
					console.error(err);
				} else {
					console.log('successfully got mindmaps from mongo');
				}

				self.db.close();
				cb(err, result);
			}

			collection.find().toArray(mindmapAddedCallback);
		});
	});
};

MindmapProvider.prototype.add = function(mindmap) {
	var self = this;

	this.db.open(function databaseOpen(err, db) {
		console.log('Connected to mongo');
		if (err) {
			throw err;
		}

		db.collection('Mindmaps', function mindmapCollection(err, collection) {
			if (err) {
				throw err;
			}

			console.log('Accessed mindmaps collection');
			function mindmapAddedCallback(err, result) {
				if (err) {
					console.error(err);
				} else {
					console.log('successfully added mindmap to mongo');
				}
			}

			collection.insert(mindmap, mindmapAddedCallback);
			self.db.close();
		});
	});
};

module.exports = MindmapProvider;
