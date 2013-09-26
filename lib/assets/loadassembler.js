mini.Module(
		"assets/loadassembler"
)
.requires(
		"assets/assetmanager"
)
.defines(function() {
	var LoadAssembler = {
		"dataPath": "data/",
		"loadJson": function(filePath, onSuccess) {
			$.getJSON(Bloob.LoadAssembler.dataPath + filePath, onSuccess)
				.fail(function( jqxhr, textStatus, error ) {
					var err = textStatus + ', ' + error;
					console.log( "Request Failed: " + err);
				});
		},
		// TODO: add smarter Logic: if the same file should be loaded twice at the same, only send one request
		// use additional field: mapIsLoading
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

	Bloob.LoadAssembler = LoadAssembler;
	
	return LoadAssembler;
});
