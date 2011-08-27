$(function() {

	var width = 1024,
	height = 768,
	paper = Raphael(document.getElementById("scene"),width,768),
	
	circle1 = paper.ellipse(100, 100, width/10, height/10),
	circle2 = paper.ellipse(300, 300, width/10, height/10);
	
	paper.connection(circle1,circle2, '#000', '#000');
	
	$("#scene").dblclick(function(evt){
		var drawnCircle = paper.ellipse(evt.clientX, evt.clientY, width/10, height/10);
		//now.add("added an object");
	})
	
	
});
