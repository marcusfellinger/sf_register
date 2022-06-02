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

    const sass = require('sass');
    const esModuleLexer = require('es-module-lexer');

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        paths: {
            root: './',
            resources: '<%= paths.root %>Resources/',
            private: '<%= paths.resources %>Private/',
            sass: '<%= paths.private %>Sass/',
            typescript: '<%= paths.private %>TypeScript/',
        },
        stylelint: {
            options: {
                configFile: '<%= paths.root %>.stylelintrc',
            },
            sass: ['<%= paths.sass %>**/*.scss']
        },
        prettier: {
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
            styles: {
                files: {
                    "<%= paths.backend %>Public/Css/style.css": "<%= paths.sass %>style.scss"
                }
            },
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
            dashboard_modal: {
                src: '<%= paths.dashboard %>Public/Css/Modal/*.css'
            },
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
        rollup: {
            options: {
                format: 'esm',
                entryFileNames: '[name].js'
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
        npmcopy: {
            options: {
                clean: false,
                report: false,
                srcPrefix: "node_modules/"
            },
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
    grunt.loadNpmTasks('grunt-eslint');
    grunt.loadNpmTasks('grunt-exec');
    grunt.loadNpmTasks('grunt-newer');
    grunt.loadNpmTasks('grunt-prettier');
    grunt.loadNpmTasks('grunt-sass');

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
    grunt.registerTask('css', ['prettier', 'newer:sass', 'newer:postcss']);

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
    grunt.registerTask('build', ['clear-build', 'update', 'concurrent:copy_static', 'concurrent:compile_assets', 'concurrent:minify_assets']);
};
