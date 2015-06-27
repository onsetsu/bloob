define(['./sqr'], function(sqr) {
  return function(a, b) {
    return sqr(a) + b;
  };
});
