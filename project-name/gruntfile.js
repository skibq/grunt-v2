'use strict';

let project_name = 'project-name';


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
                    'dist/js/main.min.js': ['dist/js/main.js']
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
                tasks: ['babel', 'uglify'],
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
                        'dist/js/*.min.js'
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
                    'dist/js/main.js': 'src/js/main.js'
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

    grunt.registerTask('default', ['browserSync', 'watch']);

    grunt.registerTask('critical', ['criticalcss', 'cssmin']);
};