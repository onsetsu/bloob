mini.Module(
	"behaviour/traits/showcase/controllableblob"
)
.requires(
	"behaviour/trait",
	"behaviour/traits/itrait"
)
.defines(function (Trait, ITrait) {

	var controllableBlob = ITrait.subclass({
		initialize: function(pb) {
			pb.withUpdate(function(x) {
				if(env.input.state(env.game.Left)) {
					//this.addGlobalForce(this.mDerivedPos, new Jello.Vector2(-3, 0));
					this.addGlobalRotationForce(10);
				} else if(env.input.state(env.game.Right)) {
					//this.addGlobalForce(this.mDerivedPos, new Jello.Vector2(3, 0));
					this.addGlobalRotationForce(-10);
				} else if(env.input.state(env.game.Up)) {
					this.addGlobalForce(this.mDerivedPos, new Jello.Vector2(0, 3));
				} else if(env.input.state(env.game.Down)) {
					this.addGlobalForce(this.mDerivedPos, new Jello.Vector2(0, -3));
				};
				if(env.input.pressed(env.game.Down)) {
					Bloob.mark("compress");
					this.setGasPressure(this.getGasPressure() / 10);
					this.setShapeMatchingConstants(250, 5);
				} else if(env.input.released(env.game.Down)) {
					Bloob.mark("decompress");
					this.setGasPressure(this.getGasPressure() * 10);
					this.setShapeMatchingConstants(150, 1);
				};
			});
		},
		update: function(entity) {
			
		}
	});

	Trait.Repository.add("showcase/controllableblob", controllableBlob);
});
