mini.Module(
	"engine/config"
)
.requires(

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
		return new Config();
	};

	return Config;
});
