define([
	'require',
	'num/num',
	"engine/rendering/image"
], function(require, num, Image) {
    var Vector2 = require('num/num').Vector2;

	var TextureMapping = mini.Class.subclass({
		initialize: function(image) {
			this.image = image;
		},
		
		from: function(coordinates) {
			// TODO: calc image part
			this.coordinates = coordinates;

			return this;
		},
		
		to: function(indices) {
			this.indices = indices;
			
			return this;
		},
		
		drawOn: function(body, image, renderer) {
			renderer.drawImageTriangleOnWorldTriangle(body, image, this);
		}
	});
	
	TextureMapping.prototype.toJson = function() {
		var json = {
			coordinates: _.map(this.coordinates, function(vector) {
				return vector.toJson();
			}),
			indices: this.indices
		};
		
		return json;
	};
	
	// Enhance given Texture with a single TextureMapping.
	TextureMapping.fromJson = function(texture, json) {
		texture
			.from(_.map(json.coordinates, function(vectorJson) {
				return Vector2.fromJson(vectorJson);
			}))
			.to(json.indices);
	};
	
	return TextureMapping;
});
