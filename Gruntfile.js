/*
 * grunt-blog
 * https://github.com/jlchereau/grunt-blog
 *
 * Copyright (c) 2013 Jacques L. Chereau
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    jshint: {
      all: [
        'Gruntfile.js',
        'tasks/*.js',
        '<%= nodeunit.tests %>'
      ],
      options: {
        jshintrc: '.jshintrc'
      }
    },

    // Before generating any new files, remove any previously-created files.
    clean: {
      tests: ['temp/']
    },

    // Configuration to be run (and then tested).
    blog: {
      /*
      default_options: {
        options: {
        }
      },
      */
      root_options: {
            options: {
                homeRoot: 'temp/',
                newsRoot: 'test/fixtures/',
                postsRoot: 'temp/'
            }
      } /*,
      custom_options: {
        options: {
            newsRoot: 'test/fixtures',
            postsRoot: 'temp'
        }
      }*/
    },

    // Unit tests.
    nodeunit: {
      tests: ['test/*_test.js']
    }

  });

  // Actually load this plugin's task(s).
  grunt.loadTasks('tasks');

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-nodeunit');

  // Whenever the "default" task is run, first clean the "temp" dir, then run this
  // plugin's task(s), then test the result.
  grunt.registerTask('default', ['jshint', 'clean', 'blog', 'nodeunit']);

};
