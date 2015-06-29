requirejs.config({
    packages: [
        { name: 'num',
          location: 'num',
          main: 'num'
        },
        { name: 'jello',
          location: 'physics',
          main: 'jello'
        }
    ],
    baseUrl: 'lib'
});

require(["editor/editorgame"], function(Editor) {});