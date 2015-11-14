module.exports = function(grunt) {

  // Plugin Registration
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-jscs');
  grunt.loadNpmTasks('grunt-mocha-istanbul');

  // Task Registration
  grunt.registerTask('default', ['test']);
  grunt.registerTask('test', ['test:quality', 'test:code']);
  grunt.registerTask('test:quality', ['jscs', 'jshint']);
  grunt.registerTask('test:code', ['mocha_istanbul']);

  // Project Configuration
  grunt.initConfig({

    // Code Quality ---------------------------------

    jscs: {
      src: ['lib/**/*.js'],
      options: {
        esnext: true,
        config: '.jscs.json'
      }
    },

    jshint: {
      all: ['lib/**/*.js']
    },

    // Tests ---------------------------------


    mocha_istanbul: {
      all: {
        src: [
          'lib/**/*.js',
          'test/**/_*.js',
          'test/**/*.spec.js'
        ],
        options: {
          coverageFolder: 'coverage',
          reportFormats: ['html']
        }
      }
    }

  });

};