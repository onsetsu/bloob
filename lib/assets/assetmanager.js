Bloob.AssetManager = {
	"maps": {}
};

Bloob.AssetManager.hasMap = function(mapPath) {
	return typeof Bloob.AssetManager.maps[mapPath] !== "undefined";
};

Bloob.AssetManager.addMap = function(mapPath, mapJson) {
	Bloob.AssetManager.maps[mapPath] = mapJson;
};

Bloob.AssetManager.getMap = function(mapPath) {
	return Bloob.AssetManager.maps[mapPath];
};

