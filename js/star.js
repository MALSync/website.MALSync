var canvas = document.getElementById("starCanvas");
var stars = [];
var fps = 60;
var frame = 0;
var remainingScroll = 0;
var running = 0;
var lastCalledTime;
var fpsRunning;
var mouse = {x: 0, y: 0};

initStars();
window.onresize = function() {
	initStars();
}
var scrollTop = (window.pageYOffset !== undefined) ? window.pageYOffset : (document.documentElement || document.body.parentNode || document.body).scrollTop;
window.onscroll = function() {
	var scrollTopTemp = (window.pageYOffset !== undefined) ? window.pageYOffset : (document.documentElement || document.body.parentNode || document.body).scrollTop;
	var scrollDistance = scrollTop - scrollTopTemp;
	scrollTop = scrollTopTemp;

	if(window.scrollTop > 800 || scrollDistance > 0){
		remainingScroll += scrollDistance;
	}
}

document.onmousemove = handleMouseMove;
function handleMouseMove(event) {
	var dot, eventDoc, doc, body, pageX, pageY;

	      event = event || window.event; // IE-ism

	      // If pageX/Y aren't available and clientX/Y are,
	      // calculate pageX/Y - logic taken from jQuery.
	      // (This is to support old IE)
	      if (event.pageX == null && event.clientX != null) {
	      	eventDoc = (event.target && event.target.ownerDocument) || document;
	      	doc = eventDoc.documentElement;
	      	body = eventDoc.body;

	      	event.pageX = event.clientX +
	      	(doc && doc.scrollLeft || body && body.scrollLeft || 0) -
	      	(doc && doc.clientLeft || body && body.clientLeft || 0);
	      	event.pageY = event.clientY +
	      	(doc && doc.scrollTop  || body && body.scrollTop  || 0) -
	      	(doc && doc.clientTop  || body && body.clientTop  || 0 );
	      }

	      // Use event.pageX / event.pageY here
	      mouse.x = event.pageX;
	      mouse.y = event.pageY - window.scrollTop ;
	  }

	  function initStars(){
	  	canvas.width = canvas.getBoundingClientRect().width;
	  	canvas.height = canvas.getBoundingClientRect().height;
	  	var ctx = canvas.getContext("2d");

	  	if(!stars.length){
	  		for(var i = 0; i < 100; i++){
	  			var star = new Star();
	  			star.init();
	  			stars.push(star);
	  		}
	  	}else{
	  		for (var star of stars) {
	  			star.init();
	  		}
	  	}
	  	drawStars();
	  	if(!running){
	        //setInterval(animate, 1000 / fps);
	        lastCalledTime = performance.now();
	        requestAnimationFrame(animate);
	        running++;
	    }
	    var speed = 0;
	    function animate(){
	        //console.log(speed);
	        if(remainingScroll < 10 && remainingScroll > -10){
	        	speed = speed - 0.05;
	        	if(speed < 0) speed = 0;
	        }else{
	        	speed = speed + 0.1;
	        	if(speed > 4) speed = 4;
	        	var scrollDistance = remainingScroll / (fps * 0.1);
	        	remainingScroll = remainingScroll - scrollDistance;
	        }

	        if(remainingScroll < 0){
	        	scrollDistance = 0 - speed;
	        }else{
	        	scrollDistance = speed;
	        }

	        if(window.scrollTop < 400){
	        	speed = 4;
	        	scrollDistance = 4;
	        }

	        for (var star of stars) {
	        	star.animate();
	        	star.offset(0, scrollDistance/star.paralaxLevel);
	          //star.mouseReaction(mouse);
	      }
	      drawStars(scrollDistance);

	      delta = (performance.now() - lastCalledTime)/1000;
	      fpsRunning = 1/delta;
	      if(fpsRunning > 20){
	      	lastCalledTime = performance.now();
	      	requestAnimationFrame(animate);
	      }else{
	      	console.log('Skip Frame');
	      	setTimeout(function(){
	      		lastCalledTime = performance.now();
	      		requestAnimationFrame(animate);
	      	}, 100)
	      }

	  }
	  function drawStars(scrollDistance){
	  	frame++;
	  	ctx.clearRect(0, 0, canvas.width, canvas.height);
	  	ctx.moveTo(0, 0);


	  	for (var star of stars) {


	  		ctx.fillStyle=star.color;
	  		ctx.fillRect(
	  			star.x,
	  			star.y,
	  			(star.size),
	  			(star.size)
	  			);

	  		var i = 10;
	  		for (var last of star.last){
	  			ctx.globalAlpha = 0.8/( i * 4 )
	  			ctx.fillStyle=star.color;
	  			ctx.fillRect(
	  				last.x,
	  				last.y,
	  				star.size,
	  				star.size
	  				);
	  			i = i - 1;
	  		}
	  		ctx.globalAlpha = 1;
	  	}
	  	ctx.stroke();
	  }
	}

	function Star() {
		this.x = 0;
		this.y = 0;
		this.xSpeed = 0;
		this.ySpeed = 0;
		this.size = 1;
		this.paralaxLevel = 1;
		this.color = 'white';
		this.last = [];
		this.init = function(){
			this.x = Math.floor(Math.random() * canvas.width);
			this.y = Math.floor(Math.random() * canvas.height);
			this.size = Math.ceil(Math.random() * 3);
			var maxSpeed = 0.08/this.size;
			this.xSpeed = (Math.random() * (maxSpeed*2))-maxSpeed;
			this.ySpeed = (Math.random() * (maxSpeed*2))-maxSpeed;
			this.paralaxLevel = Math.ceil(Math.random() * 5)+3;
		}
		this.animate = function(){
			if((frame%5) == 0){
				this.last.push({x: this.x, y: this.y});
				if (this.last.length > 10) {
					this.last.shift();
				}
			}
			var maxSpeed = 0.08/this.size;
			if (frame % 100 == 99) {
				this.xSpeed += (Math.random() * 0.0004)-0.0002;
				this.ySpeed += (Math.random() * 0.0004)-0.0002;
			}
			if(this.xSpeed > maxSpeed){
				this.xSpeed = maxSpeed;
			}else if(this.xSpeed < (maxSpeed * -1)){
				this.xSpeed = maxSpeed * -1;
			}

			if(this.ySpeed > maxSpeed){
				this.ySpeed = maxSpeed;
			}else if(this.ySpeed < (maxSpeed * -1)){
				this.ySpeed = maxSpeed * -1;
			}
	        //
	        this.y += this.ySpeed;
	        this.x += this.xSpeed;
	        if(this.x > canvas.width){
	        	this.x += (canvas.width * -1)
	        }else if(this.x < 0){
	        	this.x += canvas.width
	        }
	        if(this.y > canvas.height){
	        	this.y += (canvas.height * -1)
	        }else if(this.y < 0){
	        	this.y += canvas.height
	        }
	    }
	    this.offset = function(xOff, yOff){
	      	//if(yOff < 0 ) return;
	      	this.y += yOff;
	      	this.x += xOff;
	      }
	      this.mouseReaction = function(mouse){
	        //this.color = 'white';
	        var distx = this.x - mouse.x;
	        var disty = this.y - mouse.y;
	        var reactionDistance = 200;
	        if(distx < reactionDistance && distx > -reactionDistance){
	        	if(disty < reactionDistance && disty > -reactionDistance){
	        		if(!(distx < 15 && distx > -15 && disty < 15 && disty > -15)){
	              //this.color = 'red';

	              var speed = 5
	              var movex = speed / distx;
	              var movey = speed / disty;

	              if(distx > 0){
	              	distx = reactionDistance - distx;
	              }else{
	              	distx = -reactionDistance - distx;
	              }

	              if(disty > 0){
	              	disty = reactionDistance - disty;
	              }else{
	              	disty = -reactionDistance - disty;
	              }

	              if(1 == 1){
	              	this.xSpeed += (distx / 1000000) * -1;
	              }
	              if(1 == 1){
	              	this.ySpeed += (disty / 1000000) * -1;
	              }

	              //this.move(movex, movey);
	              return;
	          }
	      }
	  }
	}
}

window.requestAnimFrame = (function(){
	return  window.requestAnimationFrame       ||
	window.webkitRequestAnimationFrame ||
	window.mozRequestAnimationFrame    ||
	function( callback ){
		window.setTimeout(callback, 1000 / 60);
	};
})();