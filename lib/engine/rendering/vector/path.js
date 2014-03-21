mini.Module(
	"engine/rendering/vector/path"
)
.requires(

)
.defines(function() {
	var Path = mini.Class.subclass({
		// construct pathes
		initialize: function(segments, isClosed) {
			this.segments = segments || [];
			this.isClosed = isClosed || false;
		},
		
		add: function(vector) {
			this.segments.push(vector);
		},
		
		// ease pathes
		smooth: function(vector) {
		},
		
		simplify: function(tolerance) {
		},
		
		flatten: function(maxDistance) {
		},
		
		// tests for overlapping pathes
		contains: function(path) {
		},
		
		intersects: function(path) {
		},
		
		getIntersections: function(path) {
		},
		
		// create new pathes by combining 2 overlapping ones
		intersect: function(path) {
		},
		
		unite: function(path) {
		},
		
		exclude: function(path) {
		},
		
		// drawing utilities
		draw: function() {
			this.sheet.draw(targetAABB, this.tileNumber);
		}
	});
	
	Path.Circle = function() {};
	
	return Path;
});
