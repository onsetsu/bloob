mini.Module(
	"behaviour/traits/showcase/controllableblob"
)
.requires(
	"behaviour/trait",
	"behaviour/traits/itrait"
)
.defines(function (Trait, ITrait) {

	var controllableBlob = ITrait.subclass({
		update: function(entity) {
			var body = entity.getBody();
			
			// move by pressing into the desired direction
			if(env.input.state(env.game.Left)) {
				//body.addGlobalForce(body.mDerivedPos, new Jello.Vector2(-3, 0));
				body.addGlobalRotationForce(10);
			} else if(env.input.state(env.game.Right)) {
				//body.addGlobalForce(body.mDerivedPos, new Jello.Vector2(3, 0));
				body.addGlobalRotationForce(-10);
			} else if(env.input.state(env.game.Up)) {
				body.addGlobalForce(body.mDerivedPos, new Jello.Vector2(0, 3));
			} else if(env.input.state(env.game.Down)) {
				body.addGlobalForce(body.mDerivedPos, new Jello.Vector2(0, -3));
			};
			
			// compress by pressing down
			if(env.input.pressed(env.game.Down)) {
				Bloob.mark("compress");
				body.setGasPressure(body.getGasPressure() / 10);
				body.setShapeMatchingConstants(250, 5);
			} else if(env.input.released(env.game.Down)) {
				Bloob.mark("decompress");
				body.setGasPressure(body.getGasPressure() * 10);
				body.setShapeMatchingConstants(150, 1);
			};
		}
	});

	Trait.Repository.add("showcase/controllableblob", controllableBlob);
});