var ObjectPool = {};

// Enable pooling of a specific class.
ObjectPool.enableFor = function(className) {
	ObjectPool[className].objects = [];
	ObjectPool[className].count = 0;
	
};

// Creates an object of the given class, thereby tries to revive an existing one.
ObjectPool.createObject = function(className) {
	
};

// Free an object of a given class for reuse.
ObjectPool.freeForUse = function(object, className) {
	
};

