/*global module:false*/
module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    // Metadata.
    pkg: grunt.file.readJSON('package.json'),
    banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
      '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
      '<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
      '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
      ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */\n',
    // Task configuration.
    concat: {
      options: {
        banner: '<%= banner %>',
        stripBanners: true
      },
      dist: {
        src: ['lib/<%= pkg.name %>.js'],
        dest: 'dist/<%= pkg.name %>.js'
      }
    },
    concurrent: {
      copy_static: ['copy:core_icons', 'copy:install_icons', 'copy:module_icons', 'copy:extension_icons', 'copy:fonts', 'copy:t3editor'],
    },
    imagemin: {
      flags: {
        files: [
          {
            cwd: '<%= paths.sysext %>core/Resources/Public/Icons/Flags',
            src: ['**/*.{png,jpg,gif}'],
            dest: '<%= paths.sysext %>core/Resources/Public/Icons/Flags',
            expand: true
          }
        ]
      }
    },
    uglify: {
      options: {
        banner: '<%= banner %>'
      },
      dist: {
        src: '<%= concat.dist.dest %>',
        dest: 'dist/<%= pkg.name %>.min.js'
      }
    },
    jshint: {
      options: {
        curly: true,
        eqeqeq: true,
        immed: true,
        latedef: true,
        newcap: true,
        noarg: true,
        sub: true,
        undef: true,
        unused: true,
        boss: true,
        eqnull: true,
        browser: true,
        globals: {}
      },
      gruntfile: {
        src: 'Gruntfile.js'
      },
      lib_test: {
        src: ['lib/**/*.js', 'test/**/*.js']
      }
    },
    qunit: {
      files: ['test/**/*.html']
    },
    watch: {
      gruntfile: {
        files: '<%= jshint.gruntfile.src %>',
        tasks: ['jshint:gruntfile']
      },
      lib_test: {
        files: '<%= jshint.lib_test.src %>',
        tasks: ['jshint:lib_test', 'qunit']
      }
    }
  });

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-concurrent');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-imagemin');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-qunit');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');

  // Default task.
  grunt.registerTask('default', ['jshint', 'qunit', 'concat', 'uglify']);

  /**
   * grunt build task
   *
   * call "$ grunt build"
   *
   * this task does the following things:
   * - execute update task
   * - execute copy task
   * - compile sass files
   * - uglify js files
   * - minifies svg files
   * - compiles TypeScript files
   */
  grunt.registerTask('build', ['clear-build', 'update', 'concurrent:copy_static', 'concurrent:compile_assets', 'concurrent:minify_assets', 'imagemin']);

  /**
   * grunt clear-build task
   *
   * call "$ grunt clear-build"
   *
   * Removes all build-related assets, e.g. cache and built files
   */
  grunt.registerTask('clear-build', function () {
    grunt.option('force');
    grunt.file.delete('.cache');
    grunt.file.delete('JavaScript');
  });


  /**
   * grunt update task
   *
   * call "$ grunt update"
   *
   * this task does the following things:
   * - yarn install
   * - copy some components to a specific destinations because they need to be included via PHP
   */
  grunt.registerTask('update', ['exec:yarn-install', 'rollup', 'concurrent:npmcopy']);
};
