mini.Module(
	"basic/mouse"
)
.requires(
	"engine/input",
	"basic/interactionhandler"
)
.defines(function(Input, InteractionHandler) {
	var Mouse = function() {
		env.input.initMouse();
		env.input.bind(Input.KEY.MOUSE1, Mouse.LeftButton);
		env.input.bind(Input.KEY.MOUSE2, Mouse.RightButton);
		
		this.onLeftClick(new InteractionHandler());
		this.onRightClick(new InteractionHandler());
	};

	Mouse.LeftButton = "leftclick";
	Mouse.RightButton = "rightclick";

	Mouse.prototype.update = function(timePassed) {
		this.leftTechnique.fireCallback(timePassed, Mouse.LeftButton);
		this.rightTechnique.fireCallback(timePassed, Mouse.RightButton);
	};

	Mouse.prototype.onLeftClick = function(interactionTechnique, interactionTechniqueName) {
		this.leftTechnique = interactionTechnique;
		this.leftTechniqueName = this.leftTechnique.store.name;
		return this;
	};

	Mouse.prototype.onRightClick = function(interactionTechnique, interactionTechniqueName) {
		this.rightTechnique = interactionTechnique;
		this.rightTechniqueName = this.rightTechnique.store.name;
		return this;
	};

	Mouse.prototype.initDatGui = function(datGui, interactionTechniques) {
		var mouseFolder = datGui.addFolder('Mouse');
		mouseFolder.open();
		
		// Get all interaction technique names.
		var interactionTechniqueNames = [];
		var map = {};
		for (var index in interactionTechniques) {
			interactionTechniqueNames.push(interactionTechniques[index].store.name);
			map[interactionTechniques[index].store.name] = interactionTechniques[index];
		};
		
		// Enable all techniques to each button.
		var that = this;
		mouseFolder.add(this, 'leftTechniqueName', interactionTechniqueNames).listen().onChange(function(techniqueName) { that.onLeftClick(map[techniqueName]); });
		mouseFolder.add(this, 'rightTechniqueName', interactionTechniqueNames).listen().onChange(function(techniqueName) { that.onRightClick(map[techniqueName]); });
		
		return this;
	};

	return Mouse;
});
