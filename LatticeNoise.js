$(document).ready(function() {
	var c = document.getElementById("PerlC");
	c.width = window.innerWidth;
	c.height = window.innerHeight;
	ctx = c.getContext("2d");
	image = ctx.getImageData(0,0,c.width,c.height);
	var lattice = buildLattice(c.width,c.height);
function buildLattice(x,y){
	var lattice = new Array(y);
	for (var i = 0; i < lattice.length; i++) {
		lattice[i] = new Array(x);
	}

	for (var i = 0; i < c.height; i++) {
		for(var j = 0; j < c.width; j++){
			vr = randVector();
			lattice[i][j] = vr;
		}
	}
	return lattice;
}

function lerp(a0, a1, w){
	return ((1.0 - w)*a0) + (w * a1);
}

function dotGradient(ix, iy, x,  y, lattice) {
	var dx = x - (ix + 0.0);
	var dy = y - (iy + 0.0);
	//return (dx*Math.random())+(dy*Math.random());
	return (dx*lattice[Math.abs(Math.floor(iy*(c.height-1)))][Math.abs(Math.floor(ix*(c.width-1)))][0]) + (dy*lattice[Math.abs(Math.floor(iy*(c.height-1)))][Math.abs(Math.floor(ix*(c.width-1)))][1]);
}


function perlin(x,y, lattice){
	var x0 = (x > 0.0 ? Math.floor(x) : Math.floor(x) - 1);
	var x1 = x0 + 1;
	var y0 = (y > 0.0 ? Math.floor(y) : Math.floor(x) - 1);
	var y1 = y0 + 1;
	var sx = x - (x0 + 0.0);
	var sy = y - (y0 + 0.0);
	var n0 = dotGradient(x0, y0, x, y, lattice);
	var n1 = dotGradient(x1,y0,x,y, lattice);
	var ix0 = lerp(n0, n1, sx);
	var n0 = dotGradient(x0, y1, x, y, lattice);
	var n1 = dotGradient(x1,y1,x,y, lattice);
	var ix1 = lerp(n0, n1, sx);
	return lerp(ix0, ix1, sy);
}

function randVector(){
	var vx = Math.random();
	var vy = Math.sqrt(1.0 - (vx*vx));
	coin = Math.floor(Math.random()*2);
	if (coin){
		vx = vx * -1;
	}
	coin = Math.floor(Math.random()*2);
	if(coin){
		vy = vy * -1;
	}
	return [vx,vy];
}

	for (var i = 0; i < c.height; i++) {
		for (var j = 0; j < c.width; j++) {
			var perl = perlin(j/c.width,i/c.height,lattice);
			var parl = Math.floor(Math.abs(perl*16777216));
			var purl = perlin(j/c.width,i/c.height,lattice);
			hexString = parl.toString(16);
			r = parseInt(hexString.substring(0,2),16);
			g = parseInt(hexString.substring(2,4),16);
			b = parseInt(hexString.substring(4,6),16);
			var index = 4 * (j + i*c.width);
			image.data[index] = r;
			image.data[index + 1] = g;
			image.data[index + 2] = b;
			image.data[index + 3] =255;
		}
	}
	ctx.putImageData(image, 0, 0);

});