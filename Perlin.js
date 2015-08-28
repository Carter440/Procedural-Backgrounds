/*Coded By Carter Slocum
Basic Implementation of Classic Perlin Noise
Discovered by Ken Perlin
*/



$(document).ready(function() {
	var c = document.getElementById("PerlC");
	c.width = window.innerWidth;
	c.height = window.innerHeight;
	ctx = c.getContext("2d");
    var heightMap = new Array(c.height);
    
    //making grid to contain values created by perlin noise
    for (var i = 0; i < c.height; i++){
        heightMap[i] = new Array(c.width);
        for(var j = 0; j < c.width; j++){
            heightMap[i][j] = 0.0;
        }
    }
	image = ctx.getImageData(0,0,c.width,c.height);
    
function buildGradTable(x,y){
    //builds 2d array of vectors to the unit circle
    //It should be noted that later versions of Perlin Noise use the unit cube 
	var lattice = new Array(y);
	for (var i = 0; i < y; i++) {
		lattice[i] = new Array(x);
	}

	for (var i = 0; i < y; i++) {
		for(var j = 0; j < x; j++){
			vr = randVector();
			lattice[i][j] = vr;
		}
	}
	return lattice;
}


function buildPermTable(x,y){
    //builds lookup table for use by the main algorythm
    //single dimensional arrays can also work and are more memory efficient
    var permTable = new Array(y);
    //fill with values 0 to desired size
    for(var i = 0; i < y; i++){
        permTable[i] = new Array(x);
        for(var j = 0; j < x; j++){
            permTable[i][j] = new Array(2);
            permTable[i][j][0] = j;
            permTable[i][j][1] = i;
        }
    }
    //shuffle it
    for(var i = 0; i < y; i++){
    for(var j = 0; j < x; j++){
        var randy = Math.floor(Math.random() * y);
        var randx = Math.floor(Math.random() * x);
        swapper = permTable[i][j];
        permTable[i][j] = permTable[randy][randx];
        permTable[randy][randx] = swapper;
    }
    }
    return permTable
}

function randVector(){
    //creates random vector of magnitude 1
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

function perlin(x,y,grad,perm,xMax,yMax){
    //the main event
    //find surrounding vertecies
    var x0 = Math.floor(x);
    var x1 = x0 + 1;
    var y0 = Math.floor(y);
    var y1 = y0 + 1;
    //find lookup table values
    var lookup00 = perm[y0 % yMax][x0 % xMax];
    var lookup01 = perm[y0 % yMax][x1 % xMax];
    var lookup10 = perm[y1 % yMax][x0 % xMax];
    var lookup11 = perm[y1 % yMax][x1 % xMax];
    //get vectors from point to corners
    var tablex0 = x - x0;
    var tablex1 = tablex0 - 1;
    var tabley0 = y - y0;
    var tabley1 = tabley0 - 1;
    //find gradient vector dot-products
    var vector00 = grad[lookup00[1]][lookup00[0]][0]*tablex0 + grad[lookup00[1]][lookup00[0]][1]*tabley0;
    var vector01 = grad[lookup01[1]][lookup01[0]][0]*tablex1 + grad[lookup01[1]][lookup01[0]][1]*tabley0;
    var vector10 = grad[lookup10[1]][lookup10[0]][0]*tablex0 + grad[lookup10[1]][lookup10[0]][1]*tabley1;
    var vector11 = grad[lookup11[1]][lookup11[0]][0]*tablex1 + grad[lookup11[1]][lookup11[0]][1]*tabley1;
    //interpolate between values
    //many fade value functions can be used here such as 6x^5 - 15x^4 + 10x^3
    var weightX = (3 - 2*tablex0)*tablex0*tablex0;
    var vector0 = vector00 - weightX*(vector00 - vector01);
    var vector1 = vector10 - weightX*(vector10 - vector11);
    var weightY = (3 - 2*tabley0)*tabley0*tabley0;
    return vector0 - weightY*(vector0 - vector1);
}
//setting octaves to loop to higher values raises the octave of noise
    var octaves = 5;
    for(var octave = 0; octave < octaves; octave++){
        var permut = buildPermTable(256,256);
        var gradi = buildGradTable(256,256);
        for(var i = 0; i < c.height; i++){
            for(var j = 0; j < c.width; j++){
                //dividing by arbitrary number here as perlin noise returns 0 at whole numbers
               var perl = perlin(j/21,i/21,gradi,permut,256,256);
                heightMap[i][j] += perl * (255/octaves);
            }
        }
    }
    for (var i = 0; i < c.height; i++) {
		for (var j = 0; j < c.width; j++) {
        var index = 4 * (j + i*c.width);
                image.data[index] = Math.floor(127.5 + heightMap[i][j]);
                image.data[index + 1] = Math.floor(127.5 + heightMap[i][j]);
                image.data[index + 2] = Math.floor(127.5 +  heightMap[i][j]);
                image.data[index + 3] =255;
        }
    }
    
	ctx.putImageData(image, 0, 0);

});