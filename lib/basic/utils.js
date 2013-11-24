mini.Module(
	"basic/utils"
)
.requires(

)
.defines(function() {
	
	// Extensions to native Objects.

	Number.prototype.times = function(callback) {
		var i = 0;
		while(i < this) {
			callback(i++);
		}
	};
	
	// Further utility functions.
	
	var Utils = {
	
		Function: {
			
			bind: function(func, obj) {
				return function() {
					return func.apply(obj, arguments);
				};
			}
	
		},
		
		Array: {
			
			fill: function(value, length) {
				arr = [];
				for(var i = 0; i < length; i++)
					arr.push(value);
				return arr;
			},
			
			sort: function(arr, propOrAcc, context) {
				if(typeof propOrAcc === "string") {
					return _.sortBy(arr, function(element) { return element[propOrAcc]; }, context);
				} else if(typeof propOrAcc === "function") {
					return _.sortBy(arr, propOrAcc, context);
				} else {
					return _.sortBy(arr, function(element) { return element; } , context);
				}
			}
			
		},
		
		Object: {
			
			// Calls given function for each property in object with key and value as parameters.
			each: function(obj, func) {
				for(var propertyName in obj) {
					func(propertyName, obj[propertyName]);
				}
			},
			
			// Extends given object with properties of second object.
			merge: function(original, extended) {
				for( var key in extended ) {
					var ext = extended[key];
					if(
						typeof(ext) != 'object' ||
						ext instanceof HTMLElement ||
						ext instanceof mini.Class
					) {
						original[key] = ext;
					}
					else {
						if( !original[key] || typeof(original[key]) != 'object' ) {
							original[key] = (ext instanceof Array) ? [] : {};
						}
						Utils.Object.merge( original[key], ext );
					}
				}
				return original;
			}
		},
		
		String: {
			
			// Checks whether given String str ends with the given suffix.
			endsWith: function( str, suffix ) {
			    return str.indexOf(suffix, str.length - suffix.length) !== -1;
			},
			
			// Checks whether given String str starts with the given prefix.
			startsWith: function( str, prefix ) {
				return str.slice(0, prefix.length) == prefix;
			}
			
		},
		
		round: function(number, precision) {
			precision = Math.pow(10, precision || 0);
			return Math.round(number * precision) / precision;
		}

	};

	return Utils;
});
