mini.Module(
	"assets/assetmanager"
)
.requires(

)
.defines(function() {
	var AssetManager = {
			"maps": {}
	};

	AssetManager.hasMap = function(mapPath) {
		return typeof AssetManager.maps[mapPath] !== "undefined";
	};

	AssetManager.addMap = function(mapPath, mapJson) {
		AssetManager.maps[mapPath] = mapJson;
	};

	AssetManager.getMap = function(mapPath) {
		return AssetManager.maps[mapPath];
	};
	
	return AssetManager;
});

