Bloob.Scene = function() {
	this.sceneID = "scene" + Bloob.Scene.nextSceneID++;
};

Bloob.Scene.nextSceneID = 0;

Bloob.Scene.prototype.run = function() {
	this.loop.add(this, this.update, this.sceneID);
	return this;
};

Bloob.Scene.prototype.stop = function() {
	this.loop.remove(this.sceneID);
	return this;
};
