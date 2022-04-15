/*
 * This file is part of the TYPO3 CMS project.
 *
 * It is free software; you can redistribute it and/or modify it under
 * the terms of the GNU General Public License, either version 2
 * of the License, or any later version.
 *
 * For the full copyright and license information, please read the
 * LICENSE.txt file that was distributed with this source code.
 *
 * The TYPO3 project - inspiring people to share!
 */

module.exports = function (grunt) {

    const sass = require('node-sass');
    const esModuleLexer = require('es-module-lexer');

    /**
     * Grunt stylefmt task
     */
    grunt.registerMultiTask('formatsass', 'Grunt task for stylefmt', function () {
        var options = this.options(),
            done = this.async(),
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

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        paths: {
            sources: 'Sources/',
            root: '../',
            sass: '<%= paths.sources %>Sass/',
            typescript: '<%= paths.sources %>TypeScript/',
            sysext: '<%= paths.root %>',
            form: '<%= paths.sysext %>Resources/',
            dashboard: '<%= paths.sysext %>Resources/',
            frontend: '<%= paths.sysext %>Resources/',
            adminpanel: '<%= paths.sysext %>Resources/',
            install: '<%= paths.sysext %>Resources/',
            linkvalidator: '<%= paths.sysext %>Resources/',
            backend: '<%= paths.sysext %>Resources/',
            t3editor: '<%= paths.sysext %>Resources/',
            workspaces: '<%= paths.sysext %>Resources/',
            ckeditor: '<%= paths.sysext %>Resources/',
            core: '<%= paths.sysext %>Resources/',
            node_modules: 'node_modules/',
            t3icons: '<%= paths.node_modules %>@typo3/icons/dist/'
        },
        stylelint: {
            options: {
                configFile: '<%= paths.root %>.stylelintrc',
            },
            sass: ['<%= paths.sass %>**/*.scss']
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
        sass: {
            options: {
                implementation: sass,
                outputStyle: 'expanded',
                precision: 8
            },
            backend: {
                files: {
                    "<%= paths.backend %>Public/Css/backend.css": "<%= paths.sass %>backend.scss"
                }
            },
            form: {
                files: {
                    "<%= paths.form %>Public/Css/form.css": "<%= paths.sass %>form.scss"
                }
            },
            dashboard: {
                files: {
                    "<%= paths.dashboard %>Public/Css/dashboard.css": "<%= paths.sass %>dashboard.scss"
                }
            },
            dashboard_modal: {
                files: {
                    "<%= paths.dashboard %>Public/Css/Modal/style.css": "<%= paths.sass %>dashboard_modal.scss"
                }
            },
            adminpanel: {
                files: {
                    "<%= paths.adminpanel %>Public/Css/adminpanel.css": "<%= paths.sass %>adminpanel.scss"
                }
            },
            workspaces: {
                files: {
                    "<%= paths.workspaces %>Public/Css/preview.css": "<%= paths.sass %>workspace.scss"
                }
            },
            t3editor: {
                files: {
                    '<%= paths.t3editor %>Public/Css/t3editor.css': '<%= paths.sass %>editor.scss'
                }
            }
        },
        postcss: {
            options: {
                map: false,
                processors: [
                    require('autoprefixer')(),
                    require('postcss-clean')({
                        rebase: false,
                        level: {
                            1: {
                                specialComments: 0
                            }
                        }
                    }),
                    require('postcss-banner')({
                        banner: 'This file is part of the TYPO3 CMS project.\n' +
                            '\n' +
                            'It is free software; you can redistribute it and/or modify it under\n' +
                            'the terms of the GNU General Public License, either version 2\n' +
                            'of the License, or any later version.\n' +
                            '\n' +
                            'For the full copyright and license information, please read the\n' +
                            'LICENSE.txt file that was distributed with this source code.\n' +
                            '\n' +
                            'The TYPO3 project - inspiring people to share!',
                        important: true,
                        inline: false
                    })
                ]
            },
            adminpanel: {
                src: '<%= paths.adminpanel %>Public/Css/*.css'
            },
            backend: {
                src: '<%= paths.backend %>Public/Css/*.css'
            },
            core: {
                src: '<%= paths.core %>Public/Css/*.css'
            },
            dashboard: {
                src: '<%= paths.dashboard %>Public/Css/*.css'
            },
            dashboard_modal: {
                src: '<%= paths.dashboard %>Public/Css/Modal/*.css'
            },
            form: {
                src: '<%= paths.form %>Public/Css/*.css'
            },
            linkvalidator: {
                src: '<%= paths.linkvalidator %>Public/Css/*.css'
            },
            t3editor: {
                src: '<%= paths.t3editor %>Public/Css/**/*.css'
            },
            workspaces: {
                src: '<%= paths.workspaces %>Public/Css/*.css'
            }
        },
        exec: {
            ts: ((process.platform === 'win32') ? 'node_modules\\.bin\\tsc.cmd' : './node_modules/.bin/tsc') + ' --project tsconfig.json',
            'yarn-install': 'yarn install'
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
        watch: {
            options: {
                livereload: true
            },
            sass: {
                files: '<%= paths.sass %>**/*.scss',
                tasks: 'css'
            },
            ts: {
                files: '<%= paths.typescript %>/**/*.ts',
                tasks: 'scripts'
            }
        },
        copy: {
            options: {
                punctuation: ''
            },
            ts_files: {
                options: {
                    process: (source, srcpath) => {
                        const [imports, exports] = esModuleLexer.parse(source, srcpath);

                        source = require('./util/map-import.js').mapImports(source, srcpath, imports);

                        // Workaround for https://github.com/microsoft/TypeScript/issues/35802 to avoid
                        // rollup from complaining in karma/jsunit test setup:
                        //   The 'this' keyword is equivalent to 'undefined' at the top level of an ES module, and has been rewritten
                        source = source.replace('__decorate=this&&this.__decorate||function', '__decorate=function');

                        return source;
                    }
                },
                files: [{
                    expand: true,
                    cwd: '<%= paths.root %>Build/JavaScript/',
                    src: ['**/*.js', '**/*.js.map'],
                    dest: '<%= paths.sysext %>',
                    rename: (dest, src) => dest + src
                        .replace('/', '/Resources/Public/JavaScript/')
                        .replace('/Resources/Public/JavaScript/tests/', '/Tests/JavaScript/')
                }]
            },
        },
        newer: {
            options: {
                cache: './.cache/grunt-newer/'
            }
        },
        npmcopy: {
            options: {
                clean: false,
                report: false,
                srcPrefix: "node_modules/"
            },
        },
        terser: {
            options: {
                output: {
                    ecma: 8
                }
            },
            typescript: {
                options: {
                    output: {
                        preamble: '/*\n' +
                            ' * This file is part of the TYPO3 CMS project.\n' +
                            ' *\n' +
                            ' * It is free software; you can redistribute it and/or modify it under\n' +
                            ' * the terms of the GNU General Public License, either version 2\n' +
                            ' * of the License, or any later version.\n' +
                            ' *\n' +
                            ' * For the full copyright and license information, please read the\n' +
                            ' * LICENSE.txt file that was distributed with this source code.\n' +
                            ' *\n' +
                            ' * The TYPO3 project - inspiring people to share!' +
                            '\n' +
                            ' */',
                        comments: /^!/
                    }
                },
                files: [
                    {
                        expand: true,
                        src: [
                            '<%= paths.root %>Build/JavaScript/**/*.js',
                        ],
                        dest: '<%= paths.root %>Build',
                        cwd: '.',
                    }
                ]
            }
        },
        imagemin: {
            flags: {
                files: [
                    {
                        cwd: '<%= paths.core %>Public/Icons/Flags',
                        src: ['**/*.{png,jpg,gif}'],
                        dest: '<%= paths.core %>Public/Icons/Flags',
                        expand: true
                    }
                ]
            }
        },
        lintspaces: {
            html: {
                src: [
                    '<%= paths.sysext %>*/Private/**/*.html'
                ],
                options: {
                    editorconfig: '../.editorconfig'
                }
            }
        },
        concurrent: {
            npmcopy: [],
            lint: ['eslint', 'stylelint', 'lintspaces'],
            compile_assets: ['scripts', 'css'],
            minify_assets: [],
            copy_static: [],
            build: ['copy:core_icons', 'copy:install_icons', 'copy:module_icons', 'copy:extension_icons', 'copy:fonts', 'copy:t3editor'],
        },
    });

    // Register tasks
    grunt.loadNpmTasks('grunt-concurrent');
    grunt.loadNpmTasks('grunt-contrib-imagemin');
    grunt.loadNpmTasks('grunt-eslint');
    grunt.loadNpmTasks('grunt-exec');
    grunt.loadNpmTasks('grunt-newer');

    /**
     * grunt default task
     *
     * call "$ grunt"
     *
     * this will trigger the CSS build
     */
    grunt.registerTask('default', ['css']);

    /**
     * grunt lint
     *
     * call "$ grunt lint"
     *
     * this task does the following things:
     * - eslint
     * - stylelint
     * - lintspaces
     */
    grunt.registerTask('lint', ['concurrent:lint']);

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

    /**
     * grunt update task
     *
     * call "$ grunt update"
     *
     * this task does the following things:
     * - yarn install
     * - copy some components to a specific destinations because they need to be included via PHP
     */
    grunt.registerTask('update', ['exec:yarn-install', 'concurrent:npmcopy']);

    /**
     * grunt compile-typescript task
     *
     * call "$ grunt compile-typescript"
     *
     * This task does the following things:
     * - 1) Check all TypeScript files (*.ts) with ESLint which are located in sysext/<EXTKEY>/Resources/Private/TypeScript/*.ts
     * - 2) Compiles all TypeScript files (*.ts) which are located in sysext/<EXTKEY>/Resources/Private/TypeScript/*.ts
     */
    grunt.registerTask('compile-typescript', ['tsconfig', 'eslint', 'exec:ts']);

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
};