mini.Module(
		"basic/constants"
)
.requires(

)
.defines(function() {
	var Constants = {
		"Json": {
			"spawnPoints": "spawnPoints",
			"shapes": "shapes",
			"bluePrints": "bluePrints",
			"bodies": "bodies"
		}
	};
	
	Bloob.Constants = Constants;
	
	return Constants;
});
