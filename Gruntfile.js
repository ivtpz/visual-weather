module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    babel : {
      options: {
        sourceMap: true,
        presets: ['es2015']
      },
      dist: {
        files: [{
          expand: true,
          cwd: 'public/client/',
          src: ['**/*.js'],
          dest: 'build/',
          ext: '.js'
        }]
      }
    },

    concat: {
      options: {separator: ';'},
      dist: {
        src: [
          'build/**/*.js',
          'public/lib/**/*.js'
        ],
        dest: 'public/dist/<%= pkg.name %>.js',
      }
    },

    uglify: {
      target: {
        files: {
          'public/dist/<%= pkg.name %>.js': [
            'build/**/*.js', 'public/lib/**/*.js'
          ]
        }
      }
    },


    nodemon: {
      dev: {
        exec: 'babel-node --presets es2015',
        script: 'server.js',
        ignore: 'node_modules/**/*.js'
      }
    },

    browserSync: {
      dev: {
          bsFiles: {
              src : [
                'public/client/**/*.js',
                'public/**/*.css',
                'views/**/*.html'
              ]
          },
          options: {
              proxy: "localhost:3030"

          }
      }
    },

    watch: {
      scripts: {
        files: [
          'public/client/**/*.js',
          'public/lib/**/*.js'        ],
        tasks: [
          'babel', 'concat', 'uglify'
        ]
      }
    }

  });

  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-eslint');
  grunt.loadNpmTasks('grunt-shell');
  grunt.loadNpmTasks('grunt-nodemon');
  grunt.loadNpmTasks('grunt-babel');
  grunt.loadNpmTasks('grunt-browser-sync');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');


  grunt.registerTask('default', ['browserSync']);
  grunt.registerTask('server', function (target) {
    if (grunt.option('prod')) {
      grunt.task.run([ 'shell:prodServer' ]);
    } else {
      grunt.task.run(['nodemon']);
    }
  });

  ////////////////////////////////////////////////////
  // Main grunt tasks
  ////////////////////////////////////////////////////



  // grunt.registerTask('upload', function(n) {
  //   if (grunt.option('prod')) {
  //     grunt.task.run([ 'shell:push' ]);
  //   } else {
  //     grunt.task.run([ 'server' ]);
  //   }
  // });

  // grunt.registerTask('deploy', [
  //   'eslint', 'mochaTest', 'upload'
  // ]);


};
