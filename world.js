$(document).ready(function() {
	var c = document.getElementById("PerlC");
	c.width = window.innerWidth;
	c.height = window.innerHeight;
	ctx = c.getContext("2d");
    var heightMap = new Array(c.height);
    var shadowMap = new Array(c.height);
    for (var i = 0; i < c.height; i++){
        heightMap[i] = new Array(c.width);
        shadowMap[i] = new Array(c.width);
        for(var j = 0; j < c.width; j++){
            heightMap[i][j] = 0.0;
            shadowMap[i][j] = 0.0;
        }
    }
	image = ctx.getImageData(0,0,c.width,c.height);
    var colorMap = new Array(256);
    for(var i = 0; i < 137; i++){
        colorMap[i] = new Array(3);
        colorMap[i][0] = 0;
        colorMap[i][1] = Math.floor(i/2);
        colorMap[i][2] = Math.floor(i/1.5) + 140;
    }
    for(var i = 137;  i < 141; i ++){
        colorMap[i] = new Array(3);
        colorMap[i][0] = 200 + (71 - (i/3));
        colorMap[i][1] = 150 + i/4;
        colorMap[i][2] = 112;
    }
    for(var i = 141;  i < 190; i ++){
        colorMap[i] = new Array(3);
        colorMap[i][0] = Math.floor(i/3);
        colorMap[i][1] = Math.floor((i-100)*2.4);
        colorMap[i][2] = Math.floor(i/4);
    }
    for(var i = 190;  i < 217; i ++){
        colorMap[i] = new Array(3);
        colorMap[i][0] = (i-140)*3;
        colorMap[i][1] = (i-140)*3;
        colorMap[i][2] = (i-140)*3;
    }
    for(var i = 217;  i < 256; i ++){
        colorMap[i] = new Array(3);
        colorMap[i][0] = (i-180)*5.5;
        colorMap[i][1] = (i-180)*5.5;
        colorMap[i][2] = (i-180)*5.5;
    }
function buildGradTable(x,y){
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
    var permTable = new Array(y);
    for(var i = 0; i < y; i++){
        permTable[i] = new Array(x);
        for(var j = 0; j < x; j++){
            permTable[i][j] = new Array(2);
            permTable[i][j][0] = j;
            permTable[i][j][1] = i;
        }
    }
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
    var x0 = Math.floor(x);
    var x1 = x0 + 1;
    var y0 = Math.floor(y);
    var y1 = y0 + 1;
    var lookup00 = perm[y0 % yMax][x0 % xMax];
    var lookup01 = perm[y0 % yMax][x1 % xMax];
    var lookup10 = perm[y1 % yMax][x0 % xMax];
    var lookup11 = perm[y1 % yMax][x1 % xMax];
    var tablex0 = x - x0;
    var tablex1 = tablex0 - 1;
    var tabley0 = y - y0;
    var tabley1 = tabley0 - 1;
    var vector00 = grad[lookup00[1]][lookup00[0]][0]*tablex0 + grad[lookup00[1]][lookup00[0]][1]*tabley0;
    var vector01 = grad[lookup01[1]][lookup01[0]][0]*tablex1 + grad[lookup01[1]][lookup01[0]][1]*tabley0;
    var vector10 = grad[lookup10[1]][lookup10[0]][0]*tablex0 + grad[lookup10[1]][lookup10[0]][1]*tabley1;
    var vector11 = grad[lookup11[1]][lookup11[0]][0]*tablex1 + grad[lookup11[1]][lookup11[0]][1]*tabley1;
    var weightX = (3 - 2*tablex0)*tablex0*tablex0;
    var vector0 = vector00 - weightX*(vector00 - vector01);
    var vector1 = vector10 - weightX*(vector10 - vector11);
    var weightY = (3 - 2*tabley0)*tabley0*tabley0;
    return vector0 - weightY*(vector0 - vector1);
}
    var frequency = 500;
    var amp = 100;
    var lacunarity = .55;
    var gain = .7;
    
    for(var octave = 0; octave < 10; octave++){
        var permut = buildPermTable(256,256);
        var gradi = buildGradTable(256,256);
        for(var i = 0; i < c.height; i++){
            for(var j = 0; j < c.width; j++){
               var perl = perlin(j/frequency,i/frequency,gradi,permut,256,256);
                heightMap[i][j] += perl * amp;
            }
        }
        frequency *= lacunarity;
        amp *= gain;
    }
    for(var i = 0; i < c.height -1; i++){
        for(var j = 0; j < c.width; j++){
           var shadowheight = heightMap[i][j];
            if((shadowheight + 127.5) > 137){
                var checks = 0;
                while(i +(checks + 1) < c.height && heightMap[i + (checks +1)][j] + 127.5 >= 140 && shadowheight> heightMap[i+(checks +1)][j]){
                    shadowMap[i+(checks +1)][j] = 50 + (30*(shadowheight - heightMap[i + checks + 1][j]));
                    shadowheight -= .30;
                    checks +=1;
                    }
                }
            }
        }
    for (var i = 0; i < c.height; i++) {
		for (var j = 0; j < c.width; j++) {
        var index = 4 * (j + i*c.width);
            image.data[index] = colorMap[Math.floor(127.5 + heightMap[i][j])][0] - shadowMap[i][j];
            image.data[index + 1] = colorMap[Math.floor(127.5 + heightMap[i][j])][1] - shadowMap[i][j];
            image.data[index + 2] = colorMap[Math.floor(127.5 +  heightMap[i][j])][2] - shadowMap[i][j];
            image.data[index + 3] =255;
        }
    }
    
	ctx.putImageData(image, 0, 0);

});