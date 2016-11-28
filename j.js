window.onload = main

var can1,can2,c1,c2,w,h,x0,y0,tau=2*Math.PI,unit,zoom=1,wa=1,wb=2,wc=3;

function change (variableName,to,time) {
	var i = eval(variableName)
	var speed = (to-i)/time
	var z = "setInterval(function(){"+variableName+"+="+speed/10+";\
		if(Math.abs("+variableName+"-"+to+")<0.1)\
		{clearInterval(_z_"+variableName+");_z_"+variableName+"=0;\
		console.log('Done (change "+variableName+").')}},100)"
	var n = eval(z);
	eval("_z_"+variableName+"="+n)
	return n;
}

function main() {

	// get Canvases ready
	can1 = document.getElementById('firstCanvas');
	can2 = document.getElementById('secondCanvas');
	c1 = can1.getContext('2d');
	c2 = can2.getContext('2d');
	can1.style.position="absolute";
	can2.style.position="absolute";
	w_ = window.innerWidth;
	h_ = window.innerHeight;
	if (w_/2>h_) {
		can1.style.left="0px";
		can2.style.right="0px";
		can1.width = w_/2;
		can1.height = h_;
		can2.width = w_/2;
		can2.height = h_;
		w=w_/2
		h=h_
	}
	else{
		can1.style.top="0px";
		can2.style.bottom="0px";
		can1.width = w_;
		can1.height = h_/2;
		can2.width = w_;
		can2.height = h_/2;
		w=w_
		h=h_/2
	};
	x0=w/2;
	y0=h/2;

	// DRAW

	c1.lineCap = "round";
	addPoint(-1,-1,-1);
	addPoint(-1,-1,1);
	addPoint(-1,1,-1);
	addPoint(-1,1,1);
	addPoint(1,-1,-1);
	addPoint(1,-1,1);
	addPoint(1,1,-1);
	addPoint(1,1,1);
	addPoint(0,0,0);
	addLine(new Point(-1,-1,-1), new Point(-1,-1,1));
	addLine(new Point(-1,-1,-1), new Point(-1,1,-1));
	addLine(new Point(-1,-1,-1), new Point(1,-1,-1));
	addLine(new Point(-1,-1,1), new Point(-1,1,1));
	addLine(new Point(-1,-1,1), new Point(1,-1,1));
	addLine(new Point(-1,1,-1), new Point(-1,1,1));
	addLine(new Point(-1,1,-1), new Point(1,1,-1));
	addLine(new Point(1,-1,-1), new Point(1,1,-1));
	addLine(new Point(1,-1,-1), new Point(1,-1,1));
	addLine(new Point(1,1,1), new Point(1,1,-1));
	addLine(new Point(1,1,1), new Point(1,-1,1));
	addLine(new Point(1,1,1), new Point(-1,1,1));
	animate();
	setTimeout(setInterval,10000,animate,100);
}

t = 0;

function drawFrame () {
	c1.fillStyle = "#111";
	c1.fillRect(0,0,w,h);
	c2.fillStyle = "#222";
	c2.fillRect(0,0,w,h);
	c2.beginPath();
	c2.arc(x0,y0,Math.min(w/2,h/2)-5,0,tau);
	c2.lineWidth = 3;
	c2.strokeStyle = "#fff";
	c2.stroke();
	c2.fillStyle="#000";
	c2.fill();
	c2.closePath();
}

function animate () {
	drawFrame();
	unit = Math.min(w,h)/10 * zoom;
	universe.display.a += wa/100;
	universe.display.b += wb/100;
	universe.display.c += wc/100;
	t += 1;
	d = whatToDraw();
	for (var i = d.lines.length - 1; i >= 0; i--) {
		line = d.lines[i];
		drawLine(line);
	};
	for (var i = d.points.length - 1; i >= 0; i--) {
		point = d.points[i];
		drawPoint(point);
	};
}

function drawPoint (point2d) {
	var x = point2d.x;
	var y = point2d.y;
	c1.beginPath();
	c1.strokeStyle = "#fff";
	c1.lineWidth = 5;
	c1.arc(x0+x,y0-y,5,0,tau);
	c1.stroke();
	c1.closePath();
}

function drawLine (line2d) {
	c1.beginPath();
	c1.strokeStyle = "#fff";
	c1.lineWidth = 5;
	c1.moveTo(x0+line2d.x1,y0-line2d.y1);
	c1.lineTo(x0+line2d.x2,y0-line2d.y2);
	c1.stroke();
	c1.closePath();
}