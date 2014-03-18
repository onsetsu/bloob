mini.Module(
	"engine/rendering/vector/path"
)
.requires(

)
.defines(function() {
	var Path = mini.Class.subclass({
		initialize: function(segments, isClosed) {
			this.segments = segments || [];
			this.isClosed = isClosed || false;
		},
		
		add: function(vector) {
			this.segments.push(vector);
		},
		
		smooth: function(vector) {
		},
		
		simplify: function(tolerance) {
		},
		
		flatten: function(maxDistance) {
		},
		
		contains: function(path) {
		},
		
		intersect: function(path) {
		},
		
		getIntersections: function(path) {
		},
		
		draw: function() {
			this.sheet.draw(targetAABB, this.tileNumber);
		}
	});
	
	Path.Circle = function() {};
	
	return Path;
});
