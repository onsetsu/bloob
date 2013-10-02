mini.Module(
	"engine/scene"
)
.requires(
	"basic/uniqueidgenerator"
)
.defines(function(UniqueIdGenerator) {
	var Scene = mini.Class.subclass({
		initialize: function(game, loop) {
			this.sceneID = Scene.nextSceneID.nextId();
		},
		run: function() {
			this.loop.add(this, this.update, this.sceneID);
			return this;
		},
		stop: function() {
			this.loop.remove(this.sceneID);
			return this;
		}
	});

	Scene.nextSceneID = new UniqueIdGenerator("Scene");

	Bloob.Scene = Scene;
	
	return Scene;
});
