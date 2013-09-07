Jello.Bitmask = function() {
	this.clear();
};

Jello.Bitmask.prototype.clear = function() {
	this.mask = 0x00;
};

Jello.Bitmask.prototype.setOn = function(bit) {
	this.mask |= (0x01 << (bit));
};

Jello.Bitmask.prototype.setOff = function(bit) {
	this.mask &= ~(0x01 << (bit));
};

Jello.Bitmask.prototype.getBit = function(bit) {
	return ((this.mask & (0x01 << (bit))) != 0);
};
