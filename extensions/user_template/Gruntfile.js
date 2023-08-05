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

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        paths: {
            root: './',
            resources: '<%= paths.root %>Resources/',
            public: '<%= paths.resources %>Public/',
            private: '<%= paths.resources %>Private/',
            sass: '<%= paths.private %>Sass/',
            css: '<%= paths.public %>Css/',
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
                    "<%= paths.css %>style.css": "<%= paths.sass %>style.scss"
                }
            },
        },
        postcss: {
            options: {
                map: {
                    inline: false,
                    annotation: '<%= paths.css %>maps'
                },
                processors: [
                    require('autoprefixer')(),
                    require('postcss-clean')({
                        rebase: false,
                        level: {
                            1: {
                                specialComments: 0
                            }
                        }
                    })
                ],
                failOnError: true
            },
            dist: {
                src: '<%= paths.css %>*.css'
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
        lintspaces: {
            html: {
                src: [
                    '<%= paths.private %>*/**/*.html'
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
    grunt.loadNpmTasks('@lodder/grunt-postcss');
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
    grunt.registerTask('css', ['prettier', 'sass', 'postcss']);

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
    grunt.registerTask('scripts', ['compile-typescript', 'terser:typescript', 'copy:ts_files']);

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
