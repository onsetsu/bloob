mini.Module(
	"assets/converter/tojson/internalspringtojsonconverter"
)
.requires(

)
.defines(function() {
	var InternalSpringToJsonConverter = {};
	InternalSpringToJsonConverter.internalSpringToJson = function(internalSpring) {
		var resultJson = {
			"pointA": internalSpring.pointMassA,
			"pointB": internalSpring.pointMassB,
			"springD": internalSpring.springD,
			"springK": internalSpring.springK,
			"damping": internalSpring.damping
		};
		
		return resultJson;
	};

	// add convenient method
	Jello.InternalSpring.prototype.toJson = function() {
		return InternalSpringToJsonConverter.internalSpringToJson(this);
	};

	return InternalSpringToJsonConverter;
});
