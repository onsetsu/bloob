define(function() {
	var Contact = function(bodyA, bodyB) {
		this.bodyA = bodyA;
		this.bodyB = bodyB;
		this.isNew = false;
	};

	var ContactManager = function() {
		this.contacts = {};
	};

	ContactManager.prototype.processCollisions = function(world) {
		var currentCollisions = world.mCollisionList;
		
		var lastContacts = this.contacts;
		this.contacts = {};
		
		// Create contacts from collisions.
		for(var i = 0; i < currentCollisions.length; i++)
			this.addContact(
				currentCollisions[i].bodyA,
				currentCollisions[i].bodyB
			);

		var keyA, keyB;
		// Look for new contacts.
		for(keyA in this.contacts) {
			for(keyB in this.contacts[keyA]) {
				if(typeof lastContacts[keyA] !== "undefined")
					if(typeof lastContacts[keyA][keyB] !== "undefined")
						continue;
				this.contacts[keyA][keyB].isNew = true;
			}
		}

        var contact;
		// Process contacts:
		for(keyA in this.contacts) {
			for(keyB in this.contacts[keyA]) {
				contact = this.contacts[keyA][keyB];
				contact.bodyA.callOnContact(contact.bodyB, contact);
				contact.bodyB.callOnContact(contact.bodyA, contact);
				if(contact.isNew) {
					contact.bodyA.callOnStartContact(contact.bodyB, contact);
					contact.bodyB.callOnStartContact(contact.bodyA, contact);
				}
			}
		}
		for(keyA in lastContacts) {
			for(keyB in lastContacts[keyA]) {
				if(typeof this.contacts[keyA] !== "undefined") {
					if(typeof this.contacts[keyA][keyB] !== "undefined") {
						contact = lastContacts[keyA][keyB];
						contact.bodyA.callOnEndContact(contact.bodyB, contact);
						contact.bodyB.callOnEndContact(contact.bodyA, contact);
					}
				}
			}
		}
	};

	ContactManager.prototype.addContact = function(bodyA, bodyB) {
		if(typeof this.contacts[bodyA.id] === "undefined") {
			this.contacts[bodyA.id] = {};
		}
		if(typeof this.contacts[bodyB.id] === "undefined") {
			this.contacts[bodyB.id] = {};
		}
		if(typeof this.contacts[bodyA.id][bodyB.id] === "undefined") {
			var contact = new Contact(bodyA, bodyB);
			this.contacts[bodyA.id][bodyB.id] = contact;
			this.contacts[bodyB.id][bodyA.id] = contact;
		}
		return this.contacts[bodyA.id][bodyB.id];
	};
	
	return ContactManager;
});
