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
            compile_assets: ['scripts', 'css'],
            copy_static: [
//                'copy:core_icons',
//                'copy:install_icons',
//                'copy:module_icons',
//                'copy:extension_icons',
//                'copy:fonts',
//                'copy:t3editor'
            ],
            minify_assets: ['terser:thirdparty', 'terser:t3editor'],
            npmcopy: [
//                'npmcopy:ckeditor',
//                'npmcopy:ckeditor_externalplugins',
//                'npmcopy:dashboard',
//                'npmcopy:umdToEs6',
//                'npmcopy:jqueryUi',
//                'npmcopy:install',
//                'npmcopy:all'
            ],
        },
        copy: {
            core_icons: {
                files: [{
                    expand: true,
                    cwd: '<%= paths.t3icons %>',
                    src: ['**/*.svg', 'icons.json', '!install/*', '!module/*'],
                    dest: '<%= paths.sysext %>core/Resources/Public/Icons/T3Icons/',
                }]
            },
            extension_icons: {
                files: [
                    {
                        dest: '<%= paths.sysext %>form/Resources/Public/Icons/Extension.svg',
                        src: '<%= paths.t3icons %>svgs/module/module-form.svg'
                    },
                    {
                        dest: '<%= paths.sysext %>rte_ckeditor/Resources/Public/Icons/Extension.svg',
                        src: '<%= paths.t3icons %>svgs/module/module-rte-ckeditor.svg'
                    },
                    {
                        dest: '<%= paths.sysext %>linkvalidator/Resources/Public/Icons/Extension.svg',
                        src: '<%= paths.t3icons %>svgs/module/module-linkvalidator.svg'
                    }
                ]
            },
            fonts: {
                files: [
                    {
                        expand: true,
                        cwd: '<%= paths.node_modules %>source-sans-pro',
                        src: ['WOFF/OTF/**', 'WOFF2/TTF/**'],
                        dest: '<%= paths.sysext %>backend/Resources/Public/Fonts/SourceSansPro'
                    },
                    {
                        expand: true,
                        cwd: '<%= paths.node_modules %>font-awesome/fonts',
                        src: ['**/*', '!FontAwesome.otf'],
                        dest: '<%= paths.sysext %>backend/Resources/Public/Fonts/FontAwesome'
                    }
                ]
            },
            install_icons: {
                files: [
                    {
                        expand: true,
                        cwd: '<%= paths.t3icons %>svgs/install/',
                        src: ['**/*.svg'],
                        dest: '<%= paths.sysext %>install/Resources/Public/Icons/modules/',
                    }
                ]
            },
            module_icons: {
                files: [
                    {
                        dest: '<%= paths.sysext %>adminpanel/Resources/Public/Icons/module-adminpanel.svg',
                        src: '<%= paths.t3icons %>svgs/module/module-adminpanel.svg'
                    },
                    {
                        dest: '<%= paths.sysext %>install/Resources/Public/Icons/module-install.svg',
                        src: '<%= paths.t3icons %>svgs/module/module-install.svg'
                    },
                    {
                        dest: '<%= paths.sysext %>install/Resources/Public/Icons/module-install-environment.svg',
                        src: '<%= paths.t3icons %>svgs/module/module-install-environment.svg'
                    },
                    {
                        dest: '<%= paths.sysext %>install/Resources/Public/Icons/module-install-maintenance.svg',
                        src: '<%= paths.t3icons %>svgs/module/module-install-maintenance.svg'
                    },
                    {
                        dest: '<%= paths.sysext %>install/Resources/Public/Icons/module-install-settings.svg',
                        src: '<%= paths.t3icons %>svgs/module/module-install-settings.svg'
                    },
                    {
                        dest: '<%= paths.sysext %>install/Resources/Public/Icons/module-install-upgrade.svg',
                        src: '<%= paths.t3icons %>svgs/module/module-install-upgrade.svg'
                    }
                ]
            },
            t3editor: {
                files: [
                    {
                        expand: true,
                        cwd: '<%= paths.node_modules %>codemirror',
                        dest: '<%= paths.t3editor %>Public/JavaScript/Contrib/codemirror',
                        src: ['**/*', '!**/src/**', '!rollup.config.js']
                    }
                ]
            }
        },
        eslint: {
            options: {
                cache: true,
                cacheLocation: './.cache/eslintcache/',
                overrideConfigFile: 'eslintrc.json'
            },
            files: {
                src: [
                    '<%= paths.typescript %>/**/*.ts',
                    './types/**/*.ts'
                ]
            }
        },
        exec: {
            ts: ((process.platform === 'win32') ? 'node_modules\\.bin\\tsc.cmd' : './node_modules/.bin/tsc') + ' --project tsconfig.json',
            'yarn-install': 'yarn install'
        },
        formatsass: {
            sass: {
                files: [{
                    expand: true,
                    cwd: '<%= paths.sass %>',
                    src: ['**/*.scss'],
                    dest: '<%= paths.sass %>'
                }]
            }
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
        newer: {
            options: {
                cache: './.cache/grunt-newer/'
            }
        },
        npmcopy: {
            all: {
                options: {
                    destPrefix: "<%= paths.core %>Public/JavaScript/Contrib"
                },
                files: {
                    'require.js': 'requirejs/require.js',
                    'cropperjs.js': 'cropperjs/dist/cropper.esm.js',
                    'es-module-shims.js': 'es-module-shims/dist/es-module-shims.js',
                    '../../../../../backend/Resources/Public/Images/colorpicker/jquery.minicolors.png': '../node_modules/@claviska/jquery-minicolors/jquery.minicolors.png',
                }
            },
            ckeditor: {
                options: {
                    copyOptions: {
                        // Using null encoding to allow passthrough of binary files in `process`
                        encoding: null,
                        // Convert CRLF to LF in plain text files to mimic git's autocrlf behaviour
                        process: (content, srcpath) => srcpath.match(/\.(css|js|txt|html|md)$/) ? content.toString('utf8').replace(/\r\n/g, '\n') : content
                    },
                    destPrefix: "<%= paths.ckeditor %>Public/JavaScript/Contrib"
                },
                files: {
                    'ckeditor.js': 'ckeditor4/ckeditor.js',
                    'plugins/': 'ckeditor4/plugins/',
                    'skins/': 'ckeditor4/skins/',
                    'lang/': 'ckeditor4/lang/'
                }
            },
            ckeditor_externalplugins: {
                options: {
                    copyOptions: {
                        // Using null encoding to allow passthrough of binary files in `process`
                        encoding: null,
                        // Convert CRLF to LF in plain text files to mimic git's autocrlf behaviour
                        process: (content, srcpath) => srcpath.match(/\.(css|js|txt|html|md)$/) ? content.toString('utf8').replace(/\r\n/g, '\n') : content
                    },
                    destPrefix: "<%= paths.ckeditor %>Public/JavaScript/Contrib/plugins"
                },
                files: {
                    'wordcount/plugin.js': 'ckeditor-wordcount-plugin/wordcount/plugin.js',
                    'wordcount/lang/': 'ckeditor-wordcount-plugin/wordcount/lang/',
                    'wordcount/css/': 'ckeditor-wordcount-plugin/wordcount/css/',
                }
            },
            dashboard: {
                options: {
                    destPrefix: "<%= paths.dashboard %>Public",
                    copyOptions: {
                        process: (source, srcpath) => {
                            if (srcpath.match(/.*\.js$/)) {
                                const imports = [];

                                if (srcpath === 'node_modules/chart.js/dist/Chart.min.js') {
                                    imports.push('moment');
                                }
                                return require('./util/cjs-to-esm.js').cjsToEsm(source, imports);
                            }

                            return source;
                        }
                    }
                },
                files: {
                    'JavaScript/Contrib/muuri.js': 'muuri/dist/muuri.min.js',
                    'JavaScript/Contrib/chartjs.js': 'chart.js/dist/Chart.min.js',
                    'JavaScript/Contrib/web-animate.js': 'web-animate/dist/web-animate.min.js',
                    'Css/Contrib/chart.css': 'chart.js/dist/Chart.min.css'
                }
            },
            install: {
                options: {
                    destPrefix: "<%= paths.install %>Public/JavaScript",
                    copyOptions: {
                        process: (source, srcpath) => {
                            if (srcpath === 'node_modules/chosen-js/chosen.jquery.js') {
                                source = 'import jQuery from \'jquery\';\n' + source;
                            }

                            return source;
                        }
                    }
                },
                files: {
                    'chosen.jquery.min.js': 'chosen-js/chosen.jquery.js',
                }
            },
            jqueryUi: {
                options: {
                    destPrefix: "<%= paths.core %>Public/JavaScript/Contrib",
                    copyOptions: {
                        process: (source, srcpath) => {

                            const imports = {
                                core: [],
                                draggable: ['core', 'mouse', 'widget'],
                                droppable: ['core', 'widget', 'mouse', 'draggable'],
                                mouse: ['widget'],
                                position: [],
                                resizable: ['core', 'mouse', 'widget'],
                                selectable: ['core', 'mouse', 'widget'],
                                sortable: ['core', 'mouse', 'widget'],
                                widget: []
                            };

                            const moduleName = require('path').basename(srcpath, '.js');

                            const code = [
                                'import jQuery from "jquery";',
                            ];

                            if (moduleName in imports) {
                                imports[moduleName].forEach(importName => {
                                    code.push('import "jquery-ui/' + importName + '.js";');
                                });
                            }

                            code.push('let define = null;');
                            code.push(source);

                            return code.join('\n');
                        }
                    }
                },
                files: {
                    'jquery-ui/core.js': 'jquery-ui/ui/core.js',
                    'jquery-ui/draggable.js': 'jquery-ui/ui/draggable.js',
                    'jquery-ui/droppable.js': 'jquery-ui/ui/droppable.js',
                    'jquery-ui/mouse.js': 'jquery-ui/ui/mouse.js',
                    'jquery-ui/position.js': 'jquery-ui/ui/position.js',
                    'jquery-ui/resizable.js': 'jquery-ui/ui/resizable.js',
                    'jquery-ui/selectable.js': 'jquery-ui/ui/selectable.js',
                    'jquery-ui/sortable.js': 'jquery-ui/ui/sortable.js',
                    'jquery-ui/widget.js': 'jquery-ui/ui/widget.js',
                }
            },
            umdToEs6: {
                options: {
                    destPrefix: "<%= paths.core %>Public/JavaScript/Contrib",
                    copyOptions: {
                        process: (source, srcpath) => {
                            let imports = [], prefix = '';

                            if (srcpath === 'node_modules/devbridge-autocomplete/dist/jquery.autocomplete.min.js') {
                                imports.push('jquery');
                            }

                            if (srcpath === 'node_modules/@claviska/jquery-minicolors/jquery.minicolors.min.js') {
                                imports.push('jquery');
                            }

                            if (srcpath === 'node_modules/imagesloaded/imagesloaded.js') {
                                imports.push('ev-emitter');
                            }

                            if (srcpath === 'node_modules/tablesort/dist/sorts/tablesort.dotsep.min.js') {
                                prefix = 'import Tablesort from "tablesort";';
                            }

                            return require('./util/cjs-to-esm.js').cjsToEsm(source, imports, prefix);
                        }
                    }
                },
                files: {
                    'autosize.js': 'autosize/dist/autosize.min.js',
                    'broadcastchannel.js': 'broadcastchannel-polyfill/index.js',
                    'ev-emitter.js': 'ev-emitter/ev-emitter.js',
                    'flatpickr/flatpickr.min.js': 'flatpickr/dist/flatpickr.js',
                    'flatpickr/locales.js': 'flatpickr/dist/l10n/index.js',
                    'imagesloaded.js': 'imagesloaded/imagesloaded.js',
                    'jquery.js': 'jquery/dist/jquery.js',
                    'jquery.autocomplete.js': 'devbridge-autocomplete/dist/jquery.autocomplete.min.js',
                    'jquery/minicolors.js': '../node_modules/@claviska/jquery-minicolors/jquery.minicolors.min.js',
                    'moment.js': 'moment/min/moment-with-locales.min.js',
                    'moment-timezone.js': 'moment-timezone/builds/moment-timezone-with-data.min.js',
                    'nprogress.js': 'nprogress/nprogress.js',
                    'sortablejs.js': 'sortablejs/dist/sortable.umd.js',
                    'tablesort.js': 'tablesort/dist/tablesort.min.js',
                    'tablesort.dotsep.js': 'tablesort/dist/sorts/tablesort.dotsep.min.js',
                    'taboverride.js': 'taboverride/build/output/taboverride.js',
                }
            },
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
        terser: {
            t3editor: {
                files: [
                    {
                        expand: true,
                        src: [
                            '<%= paths.t3editor %>Public/JavaScript/Contrib/codemirror/**/*.js',
                            '!<%= paths.t3editor %>Public/JavaScript/Contrib/codemirror/**/*.min.js'
                        ],
                        dest: '<%= paths.t3editor %>Public/JavaScript/Contrib/codemirror',
                        cwd: '.',
                        rename: function (dest, src) {
                            return src;
                        }
                    }
                ]
            },
            thirdparty: {
                files: {
                    "<%= paths.core %>Public/JavaScript/Contrib/es-module-shims.js": ["<%= paths.core %>Public/JavaScript/Contrib/es-module-shims.js"],
                    "<%= paths.core %>Public/JavaScript/Contrib/broadcastchannel.js": ["<%= paths.core %>Public/JavaScript/Contrib/broadcastchannel.js"],
                    "<%= paths.core %>Public/JavaScript/Contrib/cropperjs.js": ["<%= paths.core %>Public/JavaScript/Contrib/cropperjs.js"],
                    "<%= paths.core %>Public/JavaScript/Contrib/imagesloaded.js": ["<%= paths.core %>Public/JavaScript/Contrib/imagesloaded.js"],
                    "<%= paths.core %>Public/JavaScript/Contrib/ev-emitter.js": ["<%= paths.core %>Public/JavaScript/Contrib/ev-emitter.js"],
                    "<%= paths.core %>Public/JavaScript/Contrib/flatpickr/flatpickr.min.js": ["<%= paths.core %>Public/JavaScript/Contrib/flatpickr/flatpickr.min.js"],
                    "<%= paths.core %>Public/JavaScript/Contrib/flatpickr/locales.js": ["<%= paths.core %>Public/JavaScript/Contrib/flatpickr/locales.js"],
                    "<%= paths.core %>Public/JavaScript/Contrib/require.js": ["<%= paths.core %>Public/JavaScript/Contrib/require.js"],
                    "<%= paths.core %>Public/JavaScript/Contrib/nprogress.js": ["<%= paths.core %>Public/JavaScript/Contrib/nprogress.js"],
                    "<%= paths.core %>Public/JavaScript/Contrib/taboverride.js": ["<%= paths.core %>Public/JavaScript/Contrib/taboverride.js"],
                    "<%= paths.core %>Public/JavaScript/Contrib/jquery-ui/core.js": ["<%= paths.core %>Public/JavaScript/Contrib/jquery-ui/core.js"],
                    "<%= paths.core %>Public/JavaScript/Contrib/jquery-ui/draggable.js": ["<%= paths.core %>Public/JavaScript/Contrib/jquery-ui/draggable.js"],
                    "<%= paths.core %>Public/JavaScript/Contrib/jquery-ui/droppable.js": ["<%= paths.core %>Public/JavaScript/Contrib/jquery-ui/droppable.js"],
                    "<%= paths.core %>Public/JavaScript/Contrib/jquery-ui/mouse.js": ["<%= paths.core %>Public/JavaScript/Contrib/jquery-ui/mouse.js"],
                    "<%= paths.core %>Public/JavaScript/Contrib/jquery-ui/position.js": ["<%= paths.core %>Public/JavaScript/Contrib/jquery-ui/position.js"],
                    "<%= paths.core %>Public/JavaScript/Contrib/jquery-ui/resizable.js": ["<%= paths.core %>Public/JavaScript/Contrib/jquery-ui/resizable.js"],
                    "<%= paths.core %>Public/JavaScript/Contrib/jquery-ui/selectable.js": ["<%= paths.core %>Public/JavaScript/Contrib/jquery-ui/selectable.js"],
                    "<%= paths.core %>Public/JavaScript/Contrib/jquery-ui/sortable.js": ["<%= paths.core %>Public/JavaScript/Contrib/jquery-ui/sortable.js"],
                    "<%= paths.core %>Public/JavaScript/Contrib/jquery-ui/widget.js": ["<%= paths.core %>Public/JavaScript/Contrib/jquery-ui/widget.js"],
                    "<%= paths.install %>Public/JavaScript/chosen.jquery.min.js": ["<%= paths.install %>Public/JavaScript/chosen.jquery.min.js"]
                }
            },
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
    grunt.loadNpmTasks('grunt-newer');
    grunt.loadNpmTasks('grunt-rollup');

    /**
     * Grunt stylefmt task
     */
    grunt.registerMultiTask('formatsass', 'Grunt task for stylefmt', function () {
        var done = this.async(),
            stylefmt = require('stylefmt'),
            scss = require('postcss-scss'),
            files = this.filesSrc.filter(function (file) {
                return grunt.file.isFile(file);
            }),
            counter = 0;
        this.files.forEach(function (file) {
            file.src.filter(function (filepath) {
                var content = grunt.file.read(filepath);
                var settings = {
                    from: filepath,
                    syntax: scss
                };
                stylefmt.process(content, settings).then(function (result) {
                    grunt.file.write(file.dest, result.css);
                    grunt.log.success('Source file "' + filepath + '" was processed.');
                    counter++;
                    if (counter >= files.length) done(true);
                });
            });
        });
    });

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
     * grunt compile-typescript task
     *
     * call "$ grunt compile-typescript"
     *
     * This task does the following things:
     * - 1) Check all TypeScript files (*.ts) with ESLint which are located in sysext/<EXTKEY>/Resources/Private/TypeScript/*.ts
     * - 2) Compiles all TypeScript files (*.ts) which are located in sysext/<EXTKEY>/Resources/Private/TypeScript/*.ts
     */
    grunt.registerTask('compile-typescript', ['tsconfig',
//        'eslint',
        'exec:ts']);

    /**
     * grunt css task
     *
     * call "$ grunt css"
     *
     * this task does the following things:
     * - formatsass
     * - sass
     * - postcss
     */
    grunt.registerTask('css', ['formatsass', 'newer:sass', 'newer:postcss']);

    // Default task.
    grunt.registerTask('default', ['jshint', 'qunit', 'concat', 'uglify']);

    /**
     * grunt scripts task
     *
     * call "$ grunt scripts"
     *
     * this task does the following things:
     * - 1) Compiles TypeScript (see compile-typescript)
     * - 2) Copy all generated JavaScript files to public folders
     * - 3) Minify build
     */
    grunt.registerTask('scripts', ['compile-typescript', 'newer:terser:typescript', 'newer:copy:ts_files']);

    /**
     * grunt tsconfig task
     *
     * call "$ grunt tsconfig"
     *
     * this task updates the tsconfig.json file with modules paths for all sysexts
     */
    grunt.task.registerTask('tsconfig', function () {
        const config = grunt.file.readJSON("tsconfig.json");
        const typescriptPath = grunt.config.get('paths.typescript');
        config.compilerOptions.paths = {};
        grunt.file.expand(typescriptPath + '*/').map(dir => dir.replace(typescriptPath, '')).forEach((path) => {
            const extname = path.match(/^([^\/]+?)\//)[1].replace(/_/g, '-')
            config.compilerOptions.paths['@typo3/' + extname + '/*'] = [path + '*'];
        });

        grunt.file.write('tsconfig.json', JSON.stringify(config, null, 4) + '\n');
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
