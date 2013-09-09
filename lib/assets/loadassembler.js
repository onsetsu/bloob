Bloob.LoadAssembler = {
	"dataPath": "data/",
	"loadJson": function(filePath, onSuccess) {
		$.getJSON(Bloob.LoadAssembler.dataPath + filePath, onSuccess)
			.fail(function( jqxhr, textStatus, error ) {
				var err = textStatus + ', ' + error;
				Scarlet.log( "Request Failed: " + err);
			});
	},
	"loadMap": function(filePath, onSuccess) {
		if(Bloob.AssetManager.hasMap(filePath)) {
			onSuccess(Bloob.AssetManager.getMap(filePath));
		}
		else
		{
			var composedOnSuccess = function(mapJson) {
				Bloob.AssetManager.addMap(filePath, mapJson);
				onSuccess(mapJson);
			};
			
			Bloob.LoadAssembler.loadJson("maps/" + filePath + ".json", composedOnSuccess);
		}
	}
};

