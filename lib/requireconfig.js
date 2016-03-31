requirejs.config({
    packages: [
        { name: 'jello',
          location: 'physics',
          main: 'jello'
        }
    ],
    baseUrl: 'lib',
    deps: ['bootstrap']
});
