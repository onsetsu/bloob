Bloob.Mouse = function(world, camera, scene) {
	this.world = world;
	this.camera = camera;
	this.scene = scene;
	this.input = new Scarlet.Input(this.camera.canvasId);
	this.input.initMouse();
	this.input.bind(Scarlet.KEY.MOUSE1, Bloob.Mouse.LeftButton);
	this.input.bind(Scarlet.KEY.MOUSE2, Bloob.Mouse.RightButton);
	
	// TODO: setDefault Handler
	//this.onLeftClick(this.selectibleTechniques["DRAG_BODY"], "DRAG_BODY");
	//this.onRightClick(this.selectibleTechniques["DRAG_BODY"], "DRAG_BODY");
};

Bloob.Mouse.LeftButton = "leftclick";
Bloob.Mouse.RightButton = "rightclick";

Bloob.Mouse.prototype.update = function(timePassed) {
	this.leftTechnique.fireCallback(this, timePassed, Bloob.Mouse.LeftButton);
	this.rightTechnique.fireCallback(this, timePassed, Bloob.Mouse.RightButton);
	this.input.clearPressed();
};

Bloob.Mouse.prototype.getMousePositionInWorld = function() {
	return new Vector2(
		this.camera.scaleX.invert(this.input.mouse.x),
		this.camera.scaleY.invert(this.input.mouse.y)
	);
};

Bloob.Mouse.prototype.onLeftClick = function(interactionTechnique, interactionTechniqueName) {
	this.leftTechnique = interactionTechnique;
	this.leftTechniqueName = this.leftTechnique.store.name;
	return this;
};

Bloob.Mouse.prototype.onRightClick = function(interactionTechnique, interactionTechniqueName) {
	this.rightTechnique = interactionTechnique;
	this.rightTechniqueName = this.rightTechnique.store.name;
	return this;
};

Bloob.Mouse.prototype.initDatGui = function(techniques) {
	var mouseFolder = gui.addFolder('Mouse');
	mouseFolder.open();
	
	// Get all interaction technique names.
	var interactionTechniqueNames = [];
	for (var technique in this.selectibleTechniques) {
		interactionTechniqueNames.push(technique);
	};
	
	// Enable all techniques to each button.
	var that = this;
	mouseFolder.add(this, 'leftTechniqueName', interactionTechniqueNames).listen().onChange(function(techniqueName) { that.onLeftClick(that.selectibleTechniques[techniqueName]); });
	mouseFolder.add(this, 'rightTechniqueName', interactionTechniqueNames).listen().onChange(function(techniqueName) { that.onRightClick(that.selectibleTechniques[techniqueName]); });
	
	return this;
};
