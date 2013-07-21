var Bitmask = function() {
	this.clear();
};

Bitmask.prototype.clear = function() {
	this.mask = 0x00;
};

Bitmask.prototype.setOn = function(bit) {
	this.mask |= (0x01 << (bit));
};

Bitmask.prototype.setOff = function(bit) {
	this.mask &= ~(0x01 << (bit));
};

Bitmask.prototype.getBit = function(bit) {
	return ((this.mask & (0x01 << (bit))) != 0);
};

