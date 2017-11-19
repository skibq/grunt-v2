'use strict';

let project_name = 'project-name';


const path = require('path');
const webpackConfig = module.exports = {
    entry: './src/js/main.js',
    output: {
        path: path.resolve(__dirname, 'dist/js/temp'),
        filename: 'main.bundle.js'
    },
    devtool: 'cheap-source-map',
};

      
module.exports = grunt => {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        uglify: {
            options: {
                sourceMap: true
                //banner: '/* text displayd at top of minified file */'
            },
            my_target: {
                files: {
                    'dist/js/production.js': ['dist/js/temp/main.bundle.es5.js']
                }
            }
        },
        cssmin: {
            options: {
                sourceMap: true
            },
            target: {
                files: {
                    'dist/css/main.min.css': 'dist/css/main.css',
                    'dist/css/critical.min.css': 'dist/css/critical.css'
                }
            }
        },
        watch: {
            configFiles: {
                files: ['gruntfile.js', 'package.json'],
                options: {
                    reload: true
                }
            },
            js: {
                files: ['src/js/*.js'],
                tasks: ['webpack', 'babel', 'uglify'],
                options: {
                    spawn: false,
                    atBegin: true
                }
            },
            css: {
                files: ['src/scss/*.scss'],
                tasks: ['sass', 'postcss', 'cssmin'],
                options: {
                    spawn: false,
                    atBegin: true
                }
            }
        },
        sass: {
            upload: {
                files: {
                    'dist/css/main.css': 'src/scss/main.scss'
                }
            }
        },
        browserSync: {
            dev: {
                bsFiles: {
                    src: [
                        '*.php',
                        'dist/css/main.min.css',
                        'dist/js/*.js'
                    ]
                },
                options: {
                    watchTask: true,
                    proxy: 'localhost/' + project_name + '/'
                }
            }
        },
        babel: {
            options: {
                sourceMap: true,
                presets: ['env']
            },
            upload: {
                files: {
                    'dist/js/temp/main.bundle.es5.js': 'dist/js/temp/main.bundle.js'
                }
            }
        },
        postcss: {
            options: {
                map: true,
                processors: [
                    require('autoprefixer')
                ]
            },
            upload: {
                src: 'dist/css/main.css'
            }
        },
        criticalcss: {
            custom: {
                options: {
                    url: 'http://localhost:3000/' + project_name,
                    width: 1200,
                    height: 900,
                    outputfile: "dist/css/critical.css",
                    filename: "dist/css/main.min.css", // Using path.resolve( path.join( ... ) ) is a good idea here
                    buffer: 800 * 1024,
                    ignoreConsole: false
                }
            }
        },
        webpack: {
            options: {
                stats: !process.env.NODE_ENV || process.env.NODE_ENV === 'development'
            },
            prod: webpackConfig,
            dev: Object.assign({
                watch: false
            }, webpackConfig)
        }

    });

    //load tasks
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-babel');
    grunt.loadNpmTasks('grunt-browser-sync');
    grunt.loadNpmTasks('grunt-postcss');
    grunt.loadNpmTasks('grunt-criticalcss');
    grunt.loadNpmTasks('grunt-webpack');

    grunt.registerTask('default', ['browserSync', 'watch']);

    grunt.registerTask('critical', ['criticalcss', 'cssmin']);
};