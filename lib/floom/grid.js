define(["floom/node", "physics/jello"], function(Node, Jello) {
	var Grid = function(){
		this.arr = [];
		this.activeCount = 0;
		this.gsizeY = 0;
	};

	Grid.prototype.clear = function() {
		this.arr.length = 0;
		this.activeCount = 0;
	};

	Grid.prototype.iterate = function(fn, context) {
		var numberOfNodes = this.arr.length;
		for(var nIndex = 0; nIndex < numberOfNodes; nIndex++) {
			var n = this.arr[nIndex];
			if (n) { fn.call(context, n); }
		}
	};

	Grid.prototype.get = function(cell) {
		return this.arr[cell];
	};
	
	Grid.prototype.getOrCreate = function(cell) {
		var node = this.arr[cell];
		
		if(node === undefined) {
			this.arr[cell] = node = new Node();
			this.activeCount++;
		}
		
		return node;
	};
	
	Grid.prototype.getSizeY = function() {
		return this.gsizeY;
	};
	
	Grid.prototype.setSizeY = function(sizeY) {
		this.gsizeY = sizeY;
	};
	
	return Grid;
});
