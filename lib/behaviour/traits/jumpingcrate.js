(function () {
	// Jump all 5 seconds.
	var jumpTimer = new Bloob.Timer(5);

	Bloob.Trait.Repository.add("jumpingcrate", function jump(entity) {
		if(jumpTimer.get() > 0) {
			jumpTimer.reset();
			var body = entity.getBody();
			body.addGlobalForce(body.getDerivedPosition().add(new Jello.Vector2(0.1, 0)), new Jello.Vector2(0, 1000));
		}
		// add additional force, if clicked on crate
		if(entity.isClicked()) {
			var body = entity.getBody();
			body.addGlobalForce(body.getDerivedPosition().add(new Jello.Vector2(0.1, 0)), new Jello.Vector2(1000, 0));
		} else if(entity.isHovered()) {
			// add additional force, if hovered over crate 
			var body = entity.getBody();
			body.addGlobalForce(body.getDerivedPosition().add(new Jello.Vector2(0.1, 0)), new Jello.Vector2(0, 100));
		}
	});
})();
