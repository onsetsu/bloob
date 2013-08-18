Bloob.UniqueIdGenerator = function(prefix) {
	this.store = {
		"prefix": prefix,
		"nextId": 0
	};
};

Bloob.UniqueIdGenerator.prototype.nextId = function() {
	return this.store.prefix + this.store.nextId++;
};
