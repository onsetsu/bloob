var DEBUG = function() {
	Scarlet.log.apply(Scarlet, arguments);
};
printf = DEBUG;

/*
 * Init
 */
var DebugDraw = function(world, options) {
	options = options || {};
	options.canvasId = options.canvasId || "bloobCanvas";
	options.canvasHeight = options.canvasHeight || 400;
	options.canvasWidth = options.canvaswidth || 800;
	options.backgroundColor = options.backgroundColor || "black";
	
	$("<canvas id='" + options.canvasId + "' width='" + options.canvasWidth + "' height='" + options.canvasHeight + "'></canvas>")
		.appendTo($("body"))
		.css("background-color", options.backgroundColor);

	this.canvasId = options.canvasId;
	this.canvas = document.getElementById(options.canvasId);
	this.context = this.canvas.getContext('2d');
	this.canvasWidth = options.canvasWidth;
	this.canvasHeight = options.canvasHeight;
	
	this.setOptions();
	
	this.scaleX = d3.scale.linear()
		.domain([world.mWorldLimits.Min.x, world.mWorldLimits.Max.x])
		.range([0, options.canvasWidth]);
	this.scaleY = d3.scale.linear()
		.domain([world.mWorldLimits.Min.y, world.mWorldLimits.Max.y])
		.range([options.canvasHeight, 0]);
	this.world = world;
};

/*
 * Drawing
 */
DebugDraw.prototype.draw = function() {
	// clear canvas
	this.context.clearRect(
		0,
		0, 
		this.canvas.width,
		this.canvas.height
	);
	
	this.world.debugDraw(this);
};

/*
 * Graphical primitives
 */
DebugDraw.prototype.drawRectangle = function(vec, size) {
	size = size || 2;
	this.context.fillRect(
		this.scaleX(vec.x) - size / 2,
		this.scaleY(vec.y) - size / 2,
		size,
		size
	);
};

DebugDraw.prototype.drawDot = function(vec, size) {
	size = size || 2;
	this.context.arc(
		this.scaleX(vec.x),
		this.scaleY(vec.y),
		size, // radius
		0,
		2 * Math.PI,
		false
	);
	this.context.fill();
};

DebugDraw.prototype.drawPolyline = function(vList) {
	// draw a polyline
	this.context.beginPath();

	this.context.moveTo(
		this.scaleX(vList[0].x),
		this.scaleY(vList[0].y)
	);
	for(var i = 1; i < vList.length; i++)
		this.context.lineTo(
			this.scaleX(vList[i].x),
			this.scaleY(vList[i].y)
		);
	this.context.lineTo(
		this.scaleX(vList[0].x),
		this.scaleY(vList[0].y)
	);
	this.context.stroke();
	
	this.context.closePath();
};

DebugDraw.prototype.drawPlus = function(point, size) {
	size = size || 3;
	
	this.context.beginPath();
	
	// draw a polyline
	this.context.moveTo(
		this.scaleX(point.x) - size,
		this.scaleY(point.y)
	);
	this.context.lineTo(
		this.scaleX(point.x) + size,
		this.scaleY(point.y)
	);
	this.context.moveTo(
		this.scaleX(point.x),
		this.scaleY(point.y) - size
	);
	this.context.lineTo(
		this.scaleX(point.x),
		this.scaleY(point.y) + size
	);

	this.context.stroke();	
	this.context.closePath();
};

/*
 * Configure Drawing
 */
DebugDraw.prototype.setOptions = function(options) {	
	// set properties
	options = options || {};
	this.color = options.color || "white";
	this.opacity = options.opacity || 1.0;
	this.lineWidth = options.lineWidth || 1.0;
	
	// apply to context
	this.context.fillStyle = this.color;
	this.context.strokeStyle = this.color;
	this.context.globalAlpha = this.opacity;
	
	this.context.lineWidth = this.lineWidth;
};
