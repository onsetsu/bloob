mini.Module(
	"behaviour/traits/showcase/jumpingcrate"
)
.requires(
	"behaviour/trait"
)
.defines(function (Trait) {
	Trait.Repository.add("showcase/jumpingcrate", function jump(entity) {
		// lazy initialization
		if(typeof this.jumpTimer === "undefined")
			// Jump all 5 seconds.
			this.jumpTimer =  new Bloob.Timer(5);

		if(this.jumpTimer.get() > 0) {
			this.jumpTimer.reset();
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
});
