Bloob.Loader = {
	"dataPath": "data/",
	"loadJson": function(filePath, onSuccess) {
		$.getJSON(Bloob.Loader.dataPath + filePath, onSuccess);
	},
	"loadShape": function(filePath, onSuccess) {
		Bloob.Loader.loadJson("shapes/" + filePath + ".json", onSuccess);
	},
	"loadBody": function(filePath, onSuccess) {
		Bloob.Loader.loadJson("bodies/" + filePath + ".json", onSuccess);
	},
	"loadMap": function(filePath, onSuccess) {
		Bloob.Loader.loadJson("maps/" + filePath + ".json", onSuccess);
	}
};
