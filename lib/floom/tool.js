define(["physics/jello"], function(Jello) {
	var Tool = function(system) {
		this.system = system;
		this.interaction = "drag";
	};

	/*
	 * UPDATE
	 */
	Tool.prototype.update = function() {
		this.handleInteraction();
	};

	// simple interaction techniques
	Tool.prototype.handleInteraction = function() {
		this.interactionLastPoint = this.interactionCurrentPoint || env.camera.screenToWorldCoordinates(env.input.mouse);
		this.interactionCurrentPoint = env.camera.screenToWorldCoordinates(env.input.mouse);

		if(env.input.state(env.game.LeftButton) || env.input.state(env.game.RightButton) || env.input.state("up")) {
			// drag
			if(env.input.state(env.game.LeftButton))
				_.each(this.system.particles, function(p) {
					if(p.position.sub(this.interactionCurrentPoint).lengthSquared() < 50)
						p.velocity.lerpSelf(this.interactionCurrentPoint.sub(this.interactionLastPoint), 0.2);
				}, this);
			else if(env.input.state(env.game.RightButton)) {
				// attract
				_.each(this.system.particles, function(p) {
					var vectorToMouse = this.interactionCurrentPoint.sub(p.position);
					var distanceToMouse = vectorToMouse.lengthSquared();
					if(distanceToMouse < 50)
						p.velocity.addSelf(vectorToMouse
								.mulFloat(1/distanceToMouse)
								.mulFloat((Math.log(1+distanceToMouse)))
								);
				}, this);
			} else if(env.input.state("up")) {
				// repel
				_.each(this.system.particles, function(p) {
					var vectorToMouse = this.interactionCurrentPoint.sub(p.position);
					var distanceToMouse = vectorToMouse.lengthSquared();
					if(distanceToMouse < 50)
						p.velocity.addSelf(vectorToMouse
								//.mulFloat(0.1)
								.mulFloat(0.1 * Math.log(1/(1+distanceToMouse)))
								);
				}, this);
			}
		} else {
			this.interactionLastPoint = undefined;
			this.interactionCurrentPoint = undefined;
		};
	};

	/*
	 * DRAWING
	 */
	Tool.prototype.draw = function() {
		// draw mouse cursor
		env.renderer.setOptions({color: "pink", opacity: 0.5});
		env.renderer.drawDot(env.camera.screenToWorldCoordinates(env.input.mouse), 10);
	};
	
	return Tool;
});
