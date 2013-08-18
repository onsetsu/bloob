Bloob.Scene = function() {
	this.sceneID = Bloob.Scene.nextSceneID.nextId();
};

Bloob.Scene.nextSceneID = new Bloob.UniqueIdGenerator("Scene");

Bloob.Scene.prototype.run = function() {
	this.loop.add(this, this.update, this.sceneID);
	return this;
};

Bloob.Scene.prototype.stop = function() {
	this.loop.remove(this.sceneID);
	return this;
};
