module.exports = function(grunt){
    grunt.initConfig({
        connect: {
            server: {
                options: {
                    port: 9003,
                    base: './build',
                    keepalive: true,
                    livereload: true
                }
            }
        },
        concat: {
            js: {
                options: {
                    // Replace all 'use strict' statements in the code with a single one at the top
                    //banner: "'use strict';\n",
                    process: function(src, filepath) {
                        return '// Source: ' + filepath + '\n' +
                        src.replace(/(^|\n)[ \t]*('use strict'|"use strict");?\s*/g, '$1');
                    },
                },
                files: {
                    'preBuild/concat.js' : [
                        'src/js/angular.min.js', 
                        'src/js/jquery.min.js', 
                        'src/js/leaflet.min.js',
                        'src/js/leaflet.markercluster.min.js',
                        'src/js/multiple-select.min.js',
                        'src/js/bootstrap.min.js',
                        'src/app/app.module.js',
                        'src/app/services/services.module.js',
                        'src/app/services/dataservice.js',
                        'src/app/services/logger.js',
                        'src/app/map/map.module.js',
                        'src/app/map/display.js',
                        'src/app/map/searchform.js',
                    ],
                }
            },
            css: {
                files: {
                    'preBuild/concat.css' : ['src/**/*.css'],
                }
            }
        },
        uglify: {
            js: {
                files: {
                    'build/minified.js': ['preBuild/concat.js']
                }
            }
        },
        cssmin: {
            options: {
                shorthandCompacting: false,
                roundingPrecision: -1
            },
            css: {
                files: {
                    'build/minified.css': ['preBuild/concat.css']
                }
            }
        },
        copy: {
            html: {
                expand: true,
                cwd: 'src/',
                src: '**/*.html',
                dest: 'build/',
            },
            img: {
                expand: true,
                cwd: 'src/',
                src: 'img/*',
                dest: 'build/',
            },
            fonts: {
                expand: true,
                cwd: 'src/',
                src: 'fonts/*',
                dest: 'build/',
            },
        },
    });

    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-copy');

    grunt.registerTask('default', ['concat', 'uglify', 'cssmin', 'copy:img', 'copy:fonts']);
};