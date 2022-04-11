/*global module:false*/
module.exports = function (grunt) {

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
            npmcopy: ['npmcopy:ckeditor', 'npmcopy:ckeditor_externalplugins', 'npmcopy:dashboard', 'npmcopy:umdToEs6', 'npmcopy:jqueryUi', 'npmcopy:install', 'npmcopy:all'],
        },
        exec: {
            'yarn-install': 'yarn install'
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
        paths: {
            sources: 'Sources/',
            root: '../',
            sass: '<%= paths.sources %>Sass/',
            typescript: '<%= paths.sources %>TypeScript/',
            sysext: '<%= paths.root %>typo3/sysext/',
            form: '<%= paths.sysext %>form/Resources/',
            dashboard: '<%= paths.sysext %>dashboard/Resources/',
            frontend: '<%= paths.sysext %>frontend/Resources/',
            adminpanel: '<%= paths.sysext %>adminpanel/Resources/',
            install: '<%= paths.sysext %>install/Resources/',
            linkvalidator: '<%= paths.sysext %>linkvalidator/Resources/',
            backend: '<%= paths.sysext %>backend/Resources/',
            t3editor: '<%= paths.sysext %>t3editor/Resources/',
            workspaces: '<%= paths.sysext %>workspaces/Resources/',
            ckeditor: '<%= paths.sysext %>rte_ckeditor/Resources/',
            core: '<%= paths.sysext %>core/Resources/',
            node_modules: 'node_modules/',
            t3icons: '<%= paths.node_modules %>@typo3/icons/dist/'
        },
        rollup: {
            options: {
                format: 'esm',
                entryFileNames: '[name].js'
            },
            'd3-selection': {
                options: {
                    preserveModules: false,
                    plugins: () => [
                        {
                            name: 'terser',
                            renderChunk: code => require('terser').minify(code, grunt.config.get('terser.options'))
                        }
                    ]
                },
                files: {
                    '<%= paths.core %>Public/JavaScript/Contrib/d3-selection.js': [
                        'node_modules/d3-selection/src/index.js'
                    ]
                }
            },
            'd3-dispatch': {
                options: {
                    preserveModules: false,
                    plugins: () => [
                        {
                            name: 'terser',
                            renderChunk: code => require('terser').minify(code, grunt.config.get('terser.options'))
                        }
                    ]
                },
                files: {
                    '<%= paths.core %>Public/JavaScript/Contrib/d3-dispatch.js': [
                        'node_modules/d3-dispatch/src/index.js'
                    ]
                }
            },
            'd3-drag': {
                options: {
                    preserveModules: false,
                    plugins: () => [
                        {
                            name: 'terser',
                            renderChunk: code => require('terser').minify(code, grunt.config.get('terser.options'))
                        },
                        {
                            name: 'externals',
                            resolveId: (source) => {
                                if (source === 'd3-selection') {
                                    return {id: 'd3-selection', external: true}
                                }
                                if (source === 'd3-dispatch') {
                                    return {id: 'd3-dispatch', external: true}
                                }
                                return null
                            }
                        }
                    ]
                },
                files: {
                    '<%= paths.core %>Public/JavaScript/Contrib/d3-drag.js': [
                        'node_modules/d3-drag/src/index.js'
                    ]
                }
            },
            'bootstrap': {
                options: {
                    preserveModules: false,
                    plugins: () => [
                        {
                            name: 'terser',
                            renderChunk: code => require('terser').minify(code, grunt.config.get('terser.options'))
                        },
                        {
                            name: 'externals',
                            resolveId: (source) => {
                                if (source === 'jquery') {
                                    return {id: 'jquery', external: true}
                                }
                                if (source === 'bootstrap') {
                                    return {id: 'node_modules/bootstrap/dist/js/bootstrap.esm.js'}
                                }
                                if (source === '@popperjs/core') {
                                    return {id: 'node_modules/@popperjs/core/dist/esm/index.js'}
                                }
                                return null
                            }
                        }
                    ]
                },
                files: {
                    '<%= paths.core %>Public/JavaScript/Contrib/bootstrap.js': [
                        'Sources/JavaScript/core/Resources/Public/JavaScript/Contrib/bootstrap.js'
                    ]
                }
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
    grunt.loadNpmTasks('grunt-exec');
    grunt.loadNpmTasks('grunt-contrib-imagemin');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-qunit');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-rollup');

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
    grunt.registerTask('update', [
        'exec:yarn-install',
//        'rollup',
        'concurrent:npmcopy'
    ]);
};
