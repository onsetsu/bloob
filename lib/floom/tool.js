define(["physics/jello"], function(Jello) {
	var Tool = function(system) {
		this.system = system;
		this.interactions = ["drag", "attract", "repel"];
		this.currentInteraction = 0;
	};

	/*
	 * UPDATE
	 */
	Tool.prototype.update = function() {
		this.interactionLastPoint = this.interactionCurrentPoint || env.camera.screenToWorldCoordinates(env.input.mouse);
		this.interactionCurrentPoint = env.camera.screenToWorldCoordinates(env.input.mouse);

		// use current interaction
		if(env.input.state(env.game.LeftButton)) {
			this.handleInteraction();
		} else {
			this.interactionLastPoint = undefined;
			this.interactionCurrentPoint = undefined;
		};

		// change current interaction
		if(env.input.pressed(env.game.RightButton)) {
			this.currentInteraction += 1;
			this.currentInteraction %= this.interactions.length;
		};
	};

	Tool.prototype.handleInteraction = function() {
		this[this.interactions[this.currentInteraction]]();
	};

	/*
	 * interactions
	 */
	Tool.prototype.drag = function() {
		_.each(this.system.particles, function(p) {
			if(p.position.sub(this.interactionCurrentPoint).lengthSquared() < 50)
				p.velocity.lerpSelf(this.interactionCurrentPoint.sub(this.interactionLastPoint), 0.2);
		}, this);
	};

	Tool.prototype.attract = function() {
		_.each(this.system.particles, function(p) {
			var vectorToMouse = this.interactionCurrentPoint.sub(p.position);
			var distanceToMouse = vectorToMouse.lengthSquared();
			if(distanceToMouse < 50)
				p.velocity.addSelf(vectorToMouse
					.mulFloat(1/distanceToMouse)
					.mulFloat((Math.log(1+distanceToMouse)))
					);
		}, this);
	};

	Tool.prototype.repel = function() {
		_.each(this.system.particles, function(p) {
			var vectorToMouse = this.interactionCurrentPoint.sub(p.position);
			var distanceToMouse = vectorToMouse.lengthSquared();
			if(distanceToMouse < 50)
				p.velocity.addSelf(vectorToMouse
					//.mulFloat(0.1)
					.mulFloat(0.1 * Math.log(1/(1+distanceToMouse)))
					);
		}, this);
	};

	/*
	 * DRAWING
	 */
	Tool.prototype.draw = function() {
		// draw mouse cursor
		env.renderer.setOptions({color: "pink", opacity: 0.5});
		env.renderer.drawDot(env.camera.screenToWorldCoordinates(env.input.mouse), 10);
		
		// draw current interaction name
		env.renderer.setOptions({color: "pink", opacity: 1.0});
		env.renderer.drawTextWorld(
			this.interactions[this.currentInteraction],
			env.camera.screenToWorldCoordinates(env.input.mouse).add(new Jello.Vector2(3, 3))
		);
	};
	
	return Tool;
});
