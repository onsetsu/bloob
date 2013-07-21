Bloob.Logic = function() {
	this.entities = [];
};

Bloob.Logic.prototype.addEntity = function(e) { // Entity
	// check for already existing.
	var exists = false; // bool
	for(var i = 0; i < this.entities.length; i++)
		if(this.entities[i] == e) {
			exists = true;
			break;
		};
	
	// do not add an already existing body
	if (!exists) {
		this.entities.push(e);
		e.logic = this;
	}
};

Bloob.Logic.prototype.getEntity = function(index) { // int, returns entity
	if ((index >= 0) && (index < this.entities.length))
		return this.entities[index];
	return undefined;
};

Bloob.Logic.prototype.update = function(timePassed) { // float
	for(var i = 0; i < this.entities.length; i++)
	{
		this.entities[i].__update__(timePassed);
	}
};

Bloob.Logic.prototype.addCamera = function(c) { // Bloob.Camera
	this.camera = c;
};
