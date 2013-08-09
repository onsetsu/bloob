Bloob.Config = function() {
	this.startLevel = 
		"MapToTestLoading"
		//"SecondMap"
	;
};

Bloob.Config.setStartLevel = function(levelName) {
	this.startLevel = levelName;
	return this;
};

Bloob.Config.getDefault = function() {
	return new Bloob.Config();
};