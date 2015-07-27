'use strict';
/* jshint node: true */

module.exports = function(grunt) {

  require('load-grunt-tasks')(grunt);

  grunt.initConfig({
    clean: {
      generated: [
        'big-collection-view.{js,css}',
        '.test-*'
      ]
    },

    watch: {
      scripts: {
        files: ['index.js'],
        tasks: ['browserify:scripts']
      },

      bigCollection: {
        files: ['node_modules/big-collection/index.js'],
        tasks: ['browserify:scripts']
      },

      testUtils: {
        files: ['test/utils.js'],
        tasks: ['browserify:testUtils']
      },

      tests: {
        files: ['test/*Spec.js'],
        tasks: ['browserify:tests']
      },

      less: {
        files: ['styles.less'],
        tasks: ['less:styles']
      },

      // karma: {
      //   files: [
      //     'big-collection-view.js',
      //     '.test-*.js'
      //   ],
      //   tasks: ['karma:singlerun']
      // }
    },

    less: {
      styles: {
        files: {
          'big-collection-view.css': 'styles.less'
        }
      },
      test: {
        files: {
        }
      }
    },

    browserify: {
      scripts: {
        options: {
          browserifyOptions: {
            standalone: 'BigCollectionView',
            debug: true
          }
        },
        files: [{
          dest: 'big-collection-view.js',
          src: 'index.js'
        }]
      },

      tests: {
        options: {
          browserifyOptions: {
            debug: true
          }
        },
        files: [{
          dest: '.test-specs.js',
          src: 'test/*Spec.js'
        }]
      },

      testUtils: {
        options: {
          browserifyOptions: {
            standalone: 'testUtils',
            debug: true
          }
        },
        files: [{
          dest: '.test-utils.js',
          src: 'test/utils.js'
        }]
      }
    },

    karma: {
      options: {
        frameworks: ['mocha'],

        browsers: [
          'PhantomJS',
          // 'Chrome'
        ],

        files: [
          {pattern: 'big-collection-view.{js,css}', included: true},

          {pattern: '.test-utils.js', included: true},
          {pattern: '.test-specs.js', included: true}
        ]
      },

      standalone: {
        options: {
          singleRun: false,
          autoWatch: true
        }
      },

      singlerun: {
        options: {
          singleRun: true,
          autoWatch: false
        }
      }
    }
  });

  grunt.registerTask('build', [
    'browserify:scripts',
    'less:styles'
  ]);

  grunt.registerTask('build-test', [
    'browserify:testUtils',
    'browserify:tests',
    'less:test'
  ]);

  grunt.registerTask('test', ['build-test', 'karma:singlerun']);

  grunt.registerTask('default', [
    'build',
    'build-test',
    'watch'
  ]);
};
