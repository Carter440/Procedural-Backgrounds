$(document).ready(function() {
	var c = document.getElementById("generatedCPU");
	c.width = window.innerWidth;
	c.height = window.innerHeight;

$(window).resize(function(){
	ctr = document.getElementById("generatedCPU");
	ctr.style.width = '100%';
	ctr.style.width = '100%';
});

var circuit = function(X,Y,weld){
	this.X = X;
	this.Y = Y;
	this.weld = weld;
	this.ctx.moveTo(X,Y);
	this.ctx.strokeStyle="#E6E6E6";
	if(weld){
		this.ctx.arc(this.X,this.Y,3,0,2*Math.PI);
		this.ctx.moveTo(X,Y);
	}
}

circuit.prototype = {
	ctx: document.getElementById("generatedCPU").getContext("2d"),
	X: 0,
	Y: 0,
	direction: 3,
	weld: false,
	go: function(direction, dist){
		switch (direction){
			case 0:
				this.ctx.lineTo(this.X, this.Y - dist);
				this.Y = this.Y - dist;
				this.direction = 0;
				break;
			case 1:
				this.ctx.lineTo(this.X,this.Y + dist);
				this.Y = this.Y + dist;
				this.direction = 1;
				break;
			case 2:
				this.ctx.lineTo(this.X - dist,this.Y);
				this.X = this.X - dist;
				this.direction = 2;
				break;
			default:
				this.ctx.lineTo(this.X + dist, this.Y);
				this.X = this.X + dist;
				this.direction = 3;
		}
		this.ctx.moveTo(this.X,this.Y)
	},
	finish: function (){
		if(this.weld){
		this.ctx.arc(this.X,this.Y,3,0,2*Math.PI);
		}
		this.ctx.stroke();

	}
}

for(var j = 0; j < (c.width*c.height)/18000; j++){
var circ = new circuit(Math.floor(Math.random()*c.width),Math.floor(Math.random()*c.height), true);
dir1 = Math.floor(Math.random()*4)%2;
dir2 = (Math.floor(Math.random()*4)%2)+2;
start = Math.floor(Math.random()*2);
for(var i = start; i < start + 4; i++){
	dist = Math.floor(Math.random()*245) + 5;
	if (i%2 === 0){
		circ.go(dir1, dist);
	}else{
		circ.go(dir2, dist);
	}
}
circ.finish();

}
});