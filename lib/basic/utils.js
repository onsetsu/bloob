Bloob.Utils = {};

Bloob.Utils.bind = function(func, obj) {
	return function() {
		return func.apply(obj, arguments);
	};
};
