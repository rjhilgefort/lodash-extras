var babelify = require('babelify');

module.exports = function (grunt) {

  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    browserify: {
      dist: {
        options: {
          debug: true,
          transform: [
            [
              "babelify",
              {}
            ]
          ]
        },
        files: {
          "dist/lodash-extras.js": ["src/index.js"]
        }
      }
    },

    uglify: {},

    watch: {
      scripts: {
        files: ["src/**/*.js"],
        tasks: ["build"]
      }
    }
  });

  grunt.registerTask('build', ['browserify:dist']);
  grunt.registerTask('default', ['build', 'watch']);
};
