mini.Module(
	"engine/scene"
)
.requires(
	"basic/uniqueidgenerator"
)
.defines(function(UniqueIdGenerator) {
	var Scene = mini.Class.subclass({
		initialize: function() {
			this.sceneID = Scene.nextSceneID.nextId();
		},
		run: function() {
			env.scene = this;
			env.loop.add(this, this.update, this.sceneID);
			return this;
		},
		stop: function() {
			env.loop.remove(this.sceneID);
			return this;
		}
	});

	Scene.nextSceneID = new UniqueIdGenerator("Scene");
	
	return Scene;
});
