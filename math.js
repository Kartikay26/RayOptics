universe = {'lines':[],'points':[], 'eye':{}, 'surfaces':[]}

universe.display = {'a':0, 'b':0, 'c':0}

var hex = ['0','1','2','3','4','5','6','7','8','9','a','b','c','d','e','f','f']

function addPoint (x,y,z,color="#fff") {
	z = new Point(x,y,z)
	z.color = color
	universe.points.push(z)
	return z;
}

function addLine (p1,p2,color="#fff") {
	z = new Line(p1,p2)
	z.color = color
	universe.lines.push(z)
	return z
}

function Point (x,y,z) {
	this.x = x
	this.y = y
	this.z = z
}

origin = new Point(0,0,0)

function Vector (p1,p2) {
	this.x = p2.x-p1.x
	this.y = p2.y-p1.y
	this.z = p2.z-p1.z

	this.toRowVector = function () {
		return new Matrix([[this.x,this.y,this.z]]);}
	this.toColumnVector = function () {
		return new Matrix([[this.x],[this.y],[this.z]]);}
}

function CoordinatesToVector(x,y,z){
	var v = new Vector(origin,new Point(x,y,z))
	return v
}

function Matrix(arr){
	// n x m Matrix
	// n down | m across ->
	// (rows) v (columns)
	// E.g., [[1,2,3],
	//        [4,5,6]]
	this.arr = arr
	this.rows = arr.length
	this.columns = arr[0].length
	
	this.Multiply = function (other) {
		var A = this
		var B = other
		if(A.columns==B.rows){
			var C = []
			for (var i = A.rows - 1; i >= 0; i--) {
				C.push([])
			}
			// Resultant matrix has size a.rows x b.columns
			for (var i = A.rows - 1; i >= 0; i--) {
				for (var j = B.columns - 1; j >= 0; j--) {
					var sum = 0
					for (var k = 0; k < A.columns; k++) {
						sum += A.arr[i][k] * B.arr[k][j]
					}
					C[i][j] = sum
				}
			}
		}
		else{
			throw "Error: Matrices incompatible for multiplication."
		}
		return new Matrix(C)
	}

	this.toVector = function (){
		if (this.rows == 1) {
			var v = this.arr[0]
			return CoordinatesToVector(v[0],v[1],v[2])
		} else if (this.columns == 1){
			var v = []
			for (var i = this.arr.length - 1; i >= 0; i--) {
				v[i]=this.arr[i]
			}
			return CoordinatesToVector(v[0],v[1],v[2])
		} else {
			throw "Error: This matrix is neither a row nor a column vector."
		}
	}
}

function getRotationMatrix(a,b,c){
	var A = new Matrix([[+Math.cos(a),+Math.sin(a),0],
						[-Math.sin(a),+Math.cos(a),0],
						[0,           0,           1]])
	var B = new Matrix([[+Math.cos(b),0,+Math.sin(b)],
						[0,           1,           0],
						[-Math.sin(b),0,+Math.cos(b)]])
	var C = new Matrix([[1,0,           0           ],
						[0,+Math.cos(c),+Math.sin(c)],
						[0,-Math.sin(c),+Math.cos(c)]])
	return A.Multiply(B.Multiply(C))
}

function Line(initial_point,final_point){
	this.initial_point = initial_point
	this.final_point = final_point
	this.direction_ratios = new Vector(initial_point,final_point)
}

function CanvasPoint (point) {

	// ISOMETRIC VIEW

	var ry = 1/2
	var rx = Math.sqrt(3)/2
	var v = new Vector(origin,point); // apply rotation matrix before display
	v = v.toColumnVector()
	M = getRotationMatrix(universe.display.a,
						  universe.display.b,
						  universe.display.c)
	v = M.Multiply(v)
	v = v.toVector()
	var x=v.x,y=v.y,z=v.z
	this.x = unit *(0+rx*x-rx*y)
	this.y = unit *(z-ry*x-ry*y)
	this.color = point.color
}

function CanvasLine (line) {
	// Converts a Line (in 3d) to a line suitable for
	// drawing on a 2d canvas.
	this.x2 = new CanvasPoint(line.final_point).x
	this.x1 = new CanvasPoint(line.initial_point).x
	this.y2 = new CanvasPoint(line.final_point).y
	this.y1 = new CanvasPoint(line.initial_point).y
	this.color = line.color
}

function whatToDraw (t) {
	var lines = []
	for (var i = universe.lines.length - 1; i >= 0; i--) {
		var l = universe.lines[i]
		var l_ = new CanvasLine(l)
		lines.push(l_)
	}
	var points = []
	for (var i = universe.points.length - 1; i >= 0; i--) {
		var p = universe.points[i]
		var p_ = new CanvasPoint(p)
		points.push(p_)
	}
	return {'lines':lines,'points':points}
}

function Eye (x,y,z,a,b,c) {
	this.x = x; // ┬
	this.y = y; // | Position of the eye
	this.z = z; // ┴
	this.a = a; // ┬
	this.b = b; // | Direction in which the eye is watching.
	this.c = c; // ┴

	this.r = new Point(x,y,z);
	// this.r = addPoint(x,y,z)

	// How the eye is supposed to work:
	/* In the beginning, run the this.getRays fxn which does the following:

		1. For each point in the universe,
		2. send a ray (straight line) from that point in all directions
		3. apply the laws of optics to that ray // build traceRay fxn
		4. see where the ray gets near the eye // v
		// 5. solve (by bisection method etc) the direction of ray so it goes
		// directly to the centre of the eye // build raySolve fxn
		// see where it meets the 'retina' <-- Not rquired ^ ^^
		6. store the colour for that point in the retina
		7. return the stored colour in this.see
		*/

	this.retina = [];
	//console.log(this.retina)
	for (var i = 0; i < w; i+=step) {
		this.retina.push([]);
	}
	for (var i = 0; i < w; i+=step) {
		for (var j = 0; j < 0; j+=step) {
			this.retina[i/step][j/step] = "#fff";
		}
	}

	this.getRays = function(){

		for (var i = universe.points.length - 1; i >= 0; i--) {
			var p = universe.points[i]
			
			var r = this.traceRay(p,1,1,1) // TODO in all directions
										   // not only 1,1,1

			var x = (tau/2+r[0])*w/(tau/2)
			var y = (1+r[1])*h

			try{
				universe.eye.retina[Math.floor(x/step)][Math.floor(y/step)] = p.color;
			}
			catch(e){
				if (universe.errors == 0) {
					console.log(e)
					console.trace()
					universe.errors ++
				}
			}
			

		};

	}

	this.traceRay = function(point,d_x,d_y,d_z){
		// Trace the ray through all the surfaces
		// use laws of optics in refracting and reflecting surfaces // ignore for now
		// return false on hitting opaque surface // ignore for now
		// if the ray gets too far return false
		// if the ray goes thru the eye and hits the retina
		//  return the point where it hit

		var x=point.x,y=point.y,z=point.z;

		var maxdistance = 10;

		var zt = 0, zs = 1/10;
		while(Math.sqrt(x*x+y*y+z*z)<maxdistance){
			
			var a = x + zs * d_x
			var b = y + zs * d_y
			var c = z + zs * d_z
			var d = surfaceBetween(x,y,z,a,b,c)

			if (d != 0) {
				// code for handling various kinds of surfaces
			} else {
				x=a;y=b;z=c;
			}

			
			if(Math.abs(distance(x,y,z,universe.eye.x,
				universe.eye.y,universe.eye.z) - 1)<eps){
				// we have hit the retina
				// return coords in Lambert projection of
				// this point wrt eye center
				// TODO problem - front / back
				return LambertProjection(x-universe.eye.x,
										 y-universe.eye.y,
										 z-universe.eye.z)
			}

			zt += zs
		}

		return false
	}

	this.see = function (x,y,e=0) {	
		var color = universe.eye.retina[x/step][y/step]
		return color
	}


	// OLD CODE
	/*
		// NOTE: FIRST CONVERT (x,y) to map coordinate system
		// rectangle (-w,-h)-(w,h) to (-3.14,-1)-(3.14,1)
		x=toLocalCoords(x,y)[0]
		y=toLocalCoords(x,y)[1]
	*/
}

var eps = 0.1;

function distance (x,y,z,a,b,c) {
	return Math.sqrt(Math.pow(x-a,2)+Math.pow(y-b,2)+Math.pow(z-c,2))
}

function surfaceBetween (x,y,z,a,b,c) {
	return 0
}

function hextodec(str){
	a = str[1]
	b = str[2]
	c = str[3]
	return [hex.indexOf(a),hex.indexOf(b),hex.indexOf(c)]
}

function reduceBrightness (str,r) {
	v = hextodec(str)
	a = (v[0]/16)/r
	b = (v[1]/16)/r
	c = (v[2]/16)/r
	return dectohex(a,b,c)
}

function dectohex (r,g,b) {
	return "#"+hex[Math.floor(Math.abs(r)*16)]
			  +hex[Math.floor(Math.abs(g)*16)]
			  +hex[Math.floor(Math.abs(b)*16)]
}

function latitude (x,y,z) {
	var R = Math.sqrt(x*x+y*y+z*z)
	var rho = Math.sqrt(x*x+y*y)
	var phi = Math.atan2(z,rho);
	return phi
}

function longitude (x,y,z) {
	var lambda = Math.atan2(y,x)
	return lambda
}

function LambertProjection (x,y,z) {
	var x_ = longitude(x,y,z)
	var y_ = Math.sin(latitude(x,y,z))
		return [x_,y_]
}

function inverseLambertProjection (x_,y_) {
	var longitude = x_
	var latitude = Math.asin(y_)
	//        lambda     phi
	return [longitude,latitude]
}

function LambertToSphere (x_,y_,r=1) {
	var z = r*Math.sin(inverseLambertProjection(x_,y_)[1])
	var p = Math.sqrt(r*r-z*z)
	var x = p*Math.cos(inverseLambertProjection(x_,y_)[0])
	var y = p*Math.sin(inverseLambertProjection(x_,y_)[0])
	return [x,y,z]
}

function toLocalCoords (x,y) {
	var x_ = x*tau/w
	var y_ = 2*y/h // think afterwards: why is this '2' here?
	return [x_,y_]
}