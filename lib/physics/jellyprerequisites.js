// TODO: List of Vectors?
// typedef std::vector<Vector2> Vector2List;

var PI = 3.14159265;
var TWO_PI = (3.14159265 * 2.0);
var HALF_PI = (3.14159265 * 0.5);
var PI_OVER_ONE_EIGHTY = (3.14159265 / 180.0);
var ONE_EIGHTY_OVER_PI = (180.0 / 3.14159265);

var absf = function(v) {
	return (v >= 0.0) ? v : -v;
};

Utils = {};
Utils.fillArray = function(value, length) {
	arr = [];
	for(var i = 0; i < length; i++)
		arr.push(value);
	return arr;
};
