define(function() {
	var JellyPrerequisites = {
        absf: function(v) {
            return (v >= 0.0) ? v : -v;
        },
    	Utils: {
            fillArray: function(value, length) {
                arr = [];
                for(var i = 0; i < length; i++)
                    arr.push(value);
                return arr;
            }
    	}
	};

	return JellyPrerequisites;
});
