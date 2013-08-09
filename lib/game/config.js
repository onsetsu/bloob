Bloob.Config = function() {
	this.startLevel = 
		"MapToTestLoading"
		//"SecondMap"
	;
};

Bloob.Config.getDefault = function() {
	return new Bloob.Config();
};