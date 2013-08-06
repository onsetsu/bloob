dat.GUI.prototype.removeFolder = function(name) {
	this.__folders[name].close();
	this.__ul.removeChild(this.__folders[name].li);
	dom.removeClass(this.__folders[name].li, 'folder');
	this.__folders[name] = undefined;
	this.onResize();
};

dat.GUI.prototype.folderExists = function(name) {
	return typeof this.__folders[name] !== "undefined";
};
