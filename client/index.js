
$(function() {

	var width = 1024,
		height = 768,
		pipe,
		circleWidth = width /10,
		circleHeight = height / 10,
		bubbles = [],
		connections = [],
		paper = Raphael(document.getElementById("scene"), width, height),
		circle1, circle2, connection1, bubble,
		Bubble = require('./bubble');
		
		bubble = new Bubble(paper);
		circle1 = bubble.create(100, 100, circleWidth, circleHeight);
		circle2 = bubble.create(300, 300, circleWidth, circleHeight);

		bubbles.push(circle1);
		bubbles.push(circle2);

		bubble.connect(circle1, circle2, '#000', '#000');

		circle1.drag(move, dragger, up);
		circle2.drag(move, dragger, up);

		function dragger () {
			this.ox = this.type == "rect" ? this.attr("x") : this.attr("cx");
			this.oy = this.type == "rect" ? this.attr("y") : this.attr("cy");
			this.animate({"fill-opacity": .2}, 500);
		};

		function move (dx, dy) {
			var att = this.type == "rect" ? {x: this.ox + dx, y: this.oy + dy} : {cx: this.ox + dx, cy: this.oy + dy};
			this.attr(att);
			for (var i = bubble.connections.length; i--;) {
				paper.connection(bubble.connections[i]);
			}
			paper.safari();
		};

		function up () {
		console.log(this);
			this.animate({"fill-opacity": 0}, 500);
		};

		pipe = new Pipe();
	/*$("#scene").dblclick(function(evt){
		var drawnCircle = paper.ellipse(evt.clientX, evt.clientY, circleWidth, circleHeight);
		bubbles.push(drawnCircle);


		drawnCircle.drag(move, dragger, up);

		//now.add("added an object");
	})*/
});

