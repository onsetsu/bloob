mini.Module(
	"basic/utils"
)
.requires(

)
.defines(function() {
	var Utils = {
		bind: function(func, obj) {
			return function() {
				return func.apply(obj, arguments);
			};
		},
	
		fillArray: function(value, length) {
			arr = [];
			for(var i = 0; i < length; i++)
				arr.push(value);
			return arr;
		}
	};

	return Utils;
});
