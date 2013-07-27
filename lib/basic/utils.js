Bloob.Utils = {};

Bloob.Utils.bind = function(func, obj) {
	return function() {
		return func.apply(obj, arguments);
	};
};

Bloob.Utils.fillArray = function(value, length) {
	arr = [];
	for(var i = 0; i < length; i++)
		arr.push(value);
	return arr;
};

var Utils = {
	"fillArray": Bloob.Utils.fillArray
};
