Bloob.ShapeBuilder = {
	"load": function(file, callback) {
		Bloob.Loader.loadShape(file, function(json) {
			var shape = new ClosedShape().begin();
			for(var i = 0; i < json.length; i++) {
				shape.addVertex(new Vector2(json[i].x, json[i].y));
			};
			shape.finish();
			
			callback(shape);
		});
	}
};
