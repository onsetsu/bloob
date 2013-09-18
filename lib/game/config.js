mini.Module(
	"game/config"
)
.requires(
	"game/loop"
)
.defines(function() {
	var Config = function() {
		this.startLevel = "MapToTestLoading";
	};

	Config.prototype.setStartLevel = function(levelName) {
		this.startLevel = levelName;
		return this;
	};

	Config.getDefault = function() {
		return new Bloob.Config();
	};

	Bloob.Config = Config;
	
	return Config;
});
