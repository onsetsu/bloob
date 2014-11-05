define([
  './affinetransformation',
  './constants',
  './vector2',
  './vectortools'
], function(AffineTransformation, constants, Vector2, VectorTools) {
  return {
    AffineTransformation: AffineTransformation,
    constants: constants,
    Vector2: Vector2,
    VectorTools: VectorTools
  };
});
