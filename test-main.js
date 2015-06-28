var allTestFiles = [];
var TEST_REGEXP = /test\.js$/;

Object.keys(window.__karma__.files).forEach(function(file) {
  if (TEST_REGEXP.test(file)) {
    // Normalize paths to RequireJS module names.
    allTestFiles.push(file);
  }
});

console.log("TEST FILES in require config:");
allTestFiles.forEach(function(file) {
console.log(file);
});
console.log("");


require.config({
  // Karma serves files under /base, which is the basePath from your config file
  baseUrl: '/base',

  // example of using a couple path translations (paths), to allow us to refer to different library dependencies, without using relative paths
  /*
  paths: {
    'jquery': '../lib/jquery',
    'underscore': '../lib/underscore',
  },
  */
  /*
  packages: [
    {
      name: 'num',
      location: 'num',
      main: 'num'
    },
    {
      name: 'jello',
      location: 'physics',
      main: 'jello'
    }
  ],
  */

  // example of using a shim, to load non AMD libraries (such as underscore)
  /*
  shim: {
    'underscore': {
      exports: '_'
    }
  },
  */

  // dynamically load all test files
  deps: allTestFiles,

  // we have to kickoff jasmine, as it is asynchronous
  callback: window.__karma__.start
});
