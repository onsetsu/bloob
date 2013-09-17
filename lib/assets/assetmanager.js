mini.Module(
		"assets/assetmanager"
)
.requires(
		"basic/uniqueidgenerator"
)
.defines(function() {
	var AssetManager = {
			"maps": {}
	};

	AssetManager.hasMap = function(mapPath) {
		return typeof Bloob.AssetManager.maps[mapPath] !== "undefined";
	};

	AssetManager.addMap = function(mapPath, mapJson) {
		Bloob.AssetManager.maps[mapPath] = mapJson;
	};

	AssetManager.getMap = function(mapPath) {
		return Bloob.AssetManager.maps[mapPath];
	};
	
	Bloob.AssetManager = AssetManager;
	
	return AssetManager;
});

