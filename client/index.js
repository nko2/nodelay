$(function() {

	var width = 1024,
		height = 768,
		circleWidth = width /10,
		circleHeight = height / 10,
		bubbles = [],
		connections = [],
		paper = Raphael(document.getElementById("scene"), width, height),
		circle1 = paper.ellipse(100, 100, circleWidth, circleHeight),
		circle2 = paper.ellipse(300, 300, circleWidth, circleHeight),
		connection1;
		
		bubbles.push(circle1);
		bubbles.push(circle2);
	
		connection1 = paper.connection(circle1,circle2, '#000', '#000');
		connections.push(connection1);
		
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
			for (var i = connections.length; i--;) {
				paper.connection(connections[i]);
			}
			paper.safari();
		};
		
		function up () {
			this.animate({"fill-opacity": 0}, 500);
		};
		
	
	$("#scene").dblclick(function(evt){
		var drawnCircle = paper.ellipse(evt.clientX, evt.clientY, circleWidth, circleHeight);
		bubbles.push(drawnCircle);
		
		drawnCircle.drag(move, dragger, up);
		
		//now.add("added an object");
	})
	
	
});
