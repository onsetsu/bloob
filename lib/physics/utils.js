define(function() {
	var utils = {
        absf: function(v) {
            return (v >= 0.0) ? v : -v;
        },
        fillArray: function(value, length) {
            arr = [];
            for(var i = 0; i < length; i++)
                arr.push(value);
            return arr;
        }
	};

	return utils;
});
