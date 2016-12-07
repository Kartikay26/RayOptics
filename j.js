window.onload = main

var can1,can2,c1,c2,w,h,x0,y0,tau=2*Math.PI,unit,zoom=2,f=10,t = 0,step=5,key
var z=0.5,wa=z,wb=-0.1*z,wc=-0.1*z
// step = 1 for perfect resolution

function change (variableName,to,time) {
	var i = eval(variableName)
	var speed = (to-i)/time
	var v = variableName.split('.')[0]
	var z = "setInterval(function(){"+variableName+"+="+speed/10+";\
		if(Math.abs("+variableName+"-"+to+")<0.1)\
		{clearInterval(_z_"+v+");_z_"+v+"=0;\
		console.log('Done (change "+variableName+").')}},100)"
	var n = eval(z)
	eval("_z_"+v+"="+n)
	return n
}

function main() {
	// get Canvases ready
	can1 = document.getElementById('firstCanvas')
	can2 = document.getElementById('secondCanvas')
	c1 = can1.getContext('2d')
	c2 = can2.getContext('2d')
	can1.style.position="absolute"
	can2.style.position="absolute"
	w_ = window.innerWidth
	h_ = window.innerHeight
	if (w_/2>h_) {
		can1.style.left="0px"
		can2.style.right="0px"
		can1.width = w_/2
		can1.height = h_
		can2.width = w_/2
		can2.height = h_
		w=w_/2
		h=h_
	}
	else{
		can1.style.top="0px"
		can2.style.bottom="0px"
		can1.width = w_
		can1.height = h_/2
		can2.width = w_
		can2.height = h_/2
		w=w_
		h=h_/2
	}
	x0=w/2
	y0=h/2

	main2()

	setInterval(animate,1000/f)
}

function drawFrame () {
	c1.fillStyle = "#111"
	c1.fillRect(0,0,w,h)
	c2.fillStyle = "#000"
	c2.fillRect(0,0,w,h)
	//if (key == 37) {wb -= 0.01;wc -= 0.01; }
    //if (key == 39) {wb += 0.01;wc += 0.01; }
    //if (key == 38) {wa -= 0.01;wb -= 0.01; }
	//if (key == 40) {wa += 0.01;wb += 0.01; }
}

window.onkeypress = function(e){
	// What happens when you press keys goes here
	// TODO -- IN THE END -- add code here for creating objects etc
}
var q = 1.0;

function animate () {
	drawFrame()
	universe.display.a += wa/100;
	universe.display.b += wb/100;
	universe.display.c += wc/100;
	unit = Math.min(w,h)/10 * zoom
	t += 1
	d = whatToDraw()
	for (var i = d.lines.length - 1; i >= 0; i--) {
		line = d.lines[i]
		drawLine(line)
	}
	for (var i = d.points.length - 1; i >= 0; i--) {
		point = d.points[i]
		drawPoint(point)
	}
	// OLD CODE
	/*
	// remove extra lines from the universe
	var oldlines = universe.lines
	universe.lines = []
	for (var zl = oldlines.length - 1; zl >= 0; zl--) {
		var l = oldlines[zl]
		if(!l.e){
			universe.lines.push(oldlines[zl])
		}
	};
	*/
	// Draw something on the "eye" canvas
	universe.eye.getRays()
	eyeDraw(universe.eye.see)
}

function drawPoint (point2d) {
	var x = point2d.x
	var y = point2d.y
	c1.beginPath()
	c1.strokeStyle = point2d.color
	c1.lineWidth = 2
	c1.arc(x0+x,y0-y,zoom,0,tau)
	c1.stroke()
	c1.closePath()
}

function drawLine (line2d) {
	c1.beginPath()
	c1.strokeStyle = line2d.color
	c1.lineWidth = 2
	c1.moveTo(x0+line2d.x1,y0-line2d.y1)
	c1.lineTo(x0+line2d.x2,y0-line2d.y2)
	c1.stroke()
	c1.closePath()
}

function eyeDraw (func) {
	for (var i = 0; i < w; i+=step) {
		for (var j = 0; j < h; j+=step) {
			//console.log(func(i,j))
			c2.fillStyle = func(i,j)
			c2.fillRect(i,j,step,step)
			// note the last 2 arguments are not coordinates
		}
	}
}

function main2 () {
	// to avoid confusion

	// DRAW
	c1.lineCap = "round"
	drawFrame()
	addLine(new Point(-1,0,0),new Point(1,0,0),'#ff0');
	addLine(new Point(0,-1,0),new Point(0,1,0),'#f0f');
	addLine(new Point(0,0,-1),new Point(0,0,1),'#0ff');
	addPoint(0,0,0,"#f00")
	universe.eye = new Eye(1,1,1,-1,-1,-1)
	universe.errors = 0
}

function addLattice (d0,centre=[0,0,0],length=1,parts=1,e=true) {
	for (var i = -parts; i <= parts; i++) {
	for (var j = -parts; j <= parts; j++) {
	for (var k = -parts; k <= parts; k++) {
	for (var l = -parts; l <= parts; l++) {
	for (var m = -parts; m <= parts; m++) {
	for (var n = -parts; n <= parts; n++) {
		var d = Math.sqrt(Math.pow(i-l,2)+Math.pow(j-m,2)+Math.pow(k-n,2))
		if (Math.abs(d - d0)<0.05) {
			var i_= i/Math.sqrt(i*i+j*j+k*k)
			var j_= j/Math.sqrt(i*i+j*j+k*k)
			var k_= k/Math.sqrt(i*i+j*j+k*k)
			var l_= l/Math.sqrt(l*l+m*m+n*n)
			var m_= m/Math.sqrt(l*l+m*m+n*n)
			var n_= n/Math.sqrt(l*l+m*m+n*n)
			var a_ = i_*l_
			var b_ = j_*m_
			var c_ = k_*n_
			if(e){
				if(a_==0&&b_==0&&c_==0){
					var a=1;var b=1;var c=1;
				}
				else{
					var a = a_/Math.sqrt(a_*a_+b_*b_+c_*c_)
					var b = b_/Math.sqrt(a_*a_+b_*b_+c_*c_)
					var c = c_/Math.sqrt(a_*a_+b_*b_+c_*c_)
				}
				addLine(new Point(length*i+centre[0],length*j+centre[1],length*k+centre[2]),
				new Point(length*l+centre[0],length*m+centre[1],length*n+centre[2]),
				dectohex(a,b,c));
				z += 1;
			}
			else{
				if(a_==0&&b_==0&&c_==0){
					var a=1;var b=1;var c=1;
				}
				else{
					var a = 0
					var b = 0
					var c = 0
				}
				addLine(new Point(length*i+centre[0],length*j+centre[1],length*k+centre[2]),
				new Point(length*l+centre[0],length*m+centre[1],length*n+centre[2]),
				dectohex(a,b,c));
				z += 1;
			}
			//addPoint(length*i+centre[0],length*j+centre[1],length*k+centre[2],dectohex(i_,j_,k_));
			//addPoint(length*l+centre[0],length*m+centre[1],length*n+centre[2],dectohex(l_,m_,n_));
		};
	};
	};
	};
	};
	};
	};
}