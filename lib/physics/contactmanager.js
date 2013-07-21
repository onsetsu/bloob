Bloob.Contact = function(bodyA, bodyB) {
	this.bodyA = bodyA;
	this.bodyB = bodyB;
	this.isNew = false;
};

Bloob.ContactManager = function() {
	this.contacts = {};
};

Bloob.ContactManager.prototype.processCollisions = function(world) {
	var currentCollisions = world.mCollisionList;
	
	var lastContacts = this.contacts;
	this.contacts = {};
	
	// Create contacts from collisions.
	for(var i = 0; i < currentCollisions.length; i++)
		this.addContact(
			currentCollisions[i].bodyA,
			currentCollisions[i].bodyB
		);
	
	// Look for new contacts.
	for(var keyA in this.contacts) {
		for(var keyB in this.contacts[keyA]) {
			if(typeof lastContacts[keyA] !== "undefined")
				if(typeof lastContacts[keyA][keyB] !== "undefined")
					continue;
			this.contacts[keyA][keyB].isNew = true;
		};
	};

	// Process contacts:
	for(var keyA in this.contacts) {
		for(var keyB in this.contacts[keyA]) {
			var contact = this.contacts[keyA][keyB];
			if(typeof contact.bodyA.entity !== "undefined")
				contact.bodyA.entity.onContact(contact.bodyB, contact);
			if(typeof contact.bodyB.entity !== "undefined")
				contact.bodyB.entity.onContact(contact.bodyA, contact);
			if(contact.isNew) {
				if(typeof contact.bodyA.entity !== "undefined")
					contact.bodyA.entity.onStartContact(contact.bodyB, contact);
				if(typeof contact.bodyB.entity !== "undefined")
					contact.bodyB.entity.onStartContact(contact.bodyA, contact);
			};
		};
	};
	for(var keyA in lastContacts) {
		for(var keyB in lastContacts[keyA]) {
			if(typeof this.contacts[keyA] !== "undefined") {
				if(typeof this.contacts[keyA][keyB] !== "undefined") {
					var contact = lastContacts[keyA][keyB];
					if(typeof contact.bodyA.entity !== "undefined")
						contact.bodyA.entity.onEndContact(contact.bodyB, contact);
					if(typeof contact.bodyB.entity !== "undefined")
						contact.bodyB.entity.onEndContact(contact.bodyA, contact);
				};
			};
		};
	};
	
};

Bloob.ContactManager.prototype.addContact = function(bodyA, bodyB) {
	if(typeof this.contacts[bodyA.id] === "undefined") {
		this.contacts[bodyA.id] = {};
	};
	if(typeof this.contacts[bodyB.id] === "undefined") {
		this.contacts[bodyB.id] = {};
	};
	if(typeof this.contacts[bodyA.id][bodyB.id] === "undefined") {
		var contact = new Bloob.Contact(bodyA, bodyB);
		this.contacts[bodyA.id][bodyB.id] = contact;
		this.contacts[bodyB.id][bodyA.id] = contact;
	};
	return this.contacts[bodyA.id][bodyB.id];
};
