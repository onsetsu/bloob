Bloob.UniqueIdGenerator = function() {
	this.store = {
		"nextId": 0
	};
};

Bloob.UniqueIdGenerator.prototype.nextId = function() {
	return this.store.nextId++;
};
