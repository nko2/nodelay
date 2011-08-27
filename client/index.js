$(function() {

	var paper = Raphael(document.getElementById("scene"),1024,768);
	paper.circle(400,250,50);
	$("#scene").click(function(evt){
		paper.rect(evt.clientX, evt.clientY, 100, 100);
	})
});
