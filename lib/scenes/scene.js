mini.Module(
	"scenes/scene"
)
.requires(
	"basic/mouse"
)
.defines(function(UniqueIdGenerator) {
	var Scene = function() {
		this.sceneID = Bloob.Scene.nextSceneID.nextId();
	};

	Scene.nextSceneID = new Bloob.UniqueIdGenerator("Scene");

	Scene.prototype.run = function() {
		this.loop.add(this, this.update, this.sceneID);
		return this;
	};

	Scene.prototype.stop = function() {
		this.loop.remove(this.sceneID);
		return this;
	};

	Bloob.Scene = Scene;
	
	return Scene;
});
