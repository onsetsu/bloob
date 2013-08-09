Bloob.Config = function() {
	this.startLevel = "MapToTestLoading";
};

Bloob.Config.prototype.setStartLevel = function(levelName) {
	this.startLevel = levelName;
	return this;
};

Bloob.Config.getDefault = function() {
	return new Bloob.Config();
};