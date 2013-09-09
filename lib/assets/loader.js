Bloob.Loader = {
	"dataPath": "data/",
	"loadJson": function(filePath, onSuccess) {
		$.getJSON(Bloob.Loader.dataPath + filePath, onSuccess)
			.fail(function( jqxhr, textStatus, error ) {
				var err = textStatus + ', ' + error;
				Scarlet.log( "Request Failed: " + err);
			});
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
