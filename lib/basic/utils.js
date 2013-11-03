mini.Module(
	"basic/utils"
)
.requires(

)
.defines(function() {
	var Utils = {
	
		Function: {
			bind: function(func, obj) {
				return function() {
					return func.apply(obj, arguments);
				};
			}
		},
		
		Array: {
			fill: function() {},
			sort: function() {}
		},
		
		fillArray: function(value, length) {
			arr = [];
			for(var i = 0; i < length; i++)
				arr.push(value);
			return arr;
		},
		
		round: function(number, precision) {
			precision = Math.pow(10, precision || 0);
			return Math.round(number * precision) / precision;
		}

	};

	return Utils;
});
