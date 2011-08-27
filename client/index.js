$(function() {

	var width = 1024,
	height = 768,
	circleWidth = width / 10,
	circleHeight = height / 10,
	connections = [],
	lastBubble,
	pipes,
	paper = Raphael(document.getElementById("scene"), width, height),
	circle1,
	circle2,
	connection1,
	mindmap,
	Mindmap = require('./mindmap'),
	User = require('./user');

	mindmap = new Mindmap(paper);
	circle1 = mindmap.createBubble(100, 100, circleWidth, circleHeight);
	lastBubble = circle2 = mindmap.createBubble(300, 300);

	mindmap.connectBubbles(circle1, circle2);

	circle1.drag(move, dragger, up);
	circle2.drag(move, dragger, up);

	function dragger() {
		this.ox = this.attr("cx");
		this.oy = this.attr("cy");
		this.animate({
			"fill-opacity": .2
		},
		500);
	};

	function move(dx, dy) {
		var att = {
			cx: this.ox + dx,
			cy: this.oy + dy
		};
		this.attr(att);
		for (var i = mindmap.connections.length; i--;) {
			paper.connection(mindmap.connections[i]);
		}
		paper.safari();
	};

	function up() {
		lastBubble = this;
		this.animate({
			"fill-opacity": 0
		},
		500);
	};

	$("label").inFieldLabels();

	$("#scene").dblclick(function(evt) {
		console.dir(evt);
		var centerY = evt.clientY - (circleHeight / 2);
		var newBubble = mindmap.createBubble(evt.clientX, centerY);
		newBubble.drag(move, dragger, up);
		mindmap.connectBubbles(lastBubble, newBubble);
		lastBubble = newBubble;
	});

	var width = 1024,
	height = 768,
	circleWidth = width / 10,

//	now.name = prompt('who are you?', '');
	user = new User();
	user.setupUser();
});

