mini.Module(
	"basic/utils"
)
.requires(
	"basic/constants"
)
.defines(function() {
	var Utils = {};

	Utils.bind = function(func, obj) {
		return function() {
			return func.apply(obj, arguments);
		};
	};

	Utils.fillArray = function(value, length) {
		arr = [];
		for(var i = 0; i < length; i++)
			arr.push(value);
		return arr;
	};
	
	Bloob.Utils = Utils;
	
	return Utils;
});
