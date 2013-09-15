// extend dat.GUI with a convenient method to remove folders
dat.gui.GUI.prototype.removeFolder = function(name) {
	if(typeof this.__folders[name] === "undefined") {
		throw new Error('Tried to remove folder ' + name + ', which not exists.');
	}
	this.__folders[name].close();
	this.__ul.removeChild(this.__folders[name].__ul.parentNode.parentNode);
	dat.dom.dom.removeClass(this.__folders[name].__ul.parentNode.parentNode, 'folder');
	this.__folders[name] = undefined;
	this.onResize();
};
