(function () {
	Bloob.Trait.Repository.add("showcase/firefly", function fly(entity) {
		var body = entity.getBody();
		// lazy initialization
		if(typeof this.center === "undefined")
			this.center = body.getDerivedPosition().add(
				// add some noise
				new Jello.Vector2(Math.random(), Math.random())
			);

		var toCenter = this.center.sub(body.getDerivedPosition());
		var direction = toCenter.getPerpendicular();
		// add force to center
		body.addGlobalForce(body.getDerivedPosition(), toCenter.mulFloat(1.5));
		// add force perpendicular to center
		body.addGlobalForce(body.getDerivedPosition(), direction.normalizedCopy().mulFloat(0.9));
	});
})();
