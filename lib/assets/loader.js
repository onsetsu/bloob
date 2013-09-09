Bloob.Loader = {
	"dataPath": "data/",
	"loadJson": function(filePath, onSuccess) {
		$.getJSON(Bloob.Loader.dataPath + filePath, onSuccess)
			.fail(function( jqxhr, textStatus, error ) {
				var err = textStatus + ', ' + error;
				Scarlet.log( "Request Failed: " + err);
			});
	},
	"loadMap": function(filePath, onSuccess) {
		Bloob.Loader.loadJson("maps/" + filePath + ".json", onSuccess);
	}
};
