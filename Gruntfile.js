module.exports = function(grunt) {

    "use strict";

    var watching = grunt.option('watching');
    var tasks, time = new Date(), day = time.getDate(), month = time.getMonth()+1, year = time.getFullYear(), hour = time.getHours(), mins = time.getMinutes(), sec = time.getSeconds();
    var timestamp = (day < 10 ? "0"+day:day) + "/" + (month < 10 ? "0"+month:month) + "/" + (year) + " " + (hour<10?"0"+hour:hour) + ":" + (mins<10?"0"+mins:mins) + ":" + (sec<10?"0"+sec:sec);

    require('load-grunt-tasks')(grunt);

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        copyright: '/*\n' +
        ' * Metro 4 Components Library v<%= pkg.version %> build @@build<%= pkg.version_suffix %> (<%= pkg.homepage %>)\n' +
        ' * Copyright 2012 - <%= grunt.template.today("yyyy") %> <%= pkg.author %>\n' +
        ' * Licensed under <%= pkg.license %>\n' +
        ' */\n',

        banner: "( function( global, factory ) {\n" +
            "\n" +
            "\t\"use strict\";\n" +
            "\n" +
            "\tif ( typeof module === \"object\" && typeof module.exports === \"object\" ) {\n" +
            "\n" +
            "\t\tmodule.exports = global.document ?\n" +
            "\t\t\tfactory( global, true ) :\n" +
            "\t\t\tfunction( w ) {\n" +
            "\t\t\t\tif ( !w.document ) {\n" +
            "\t\t\t\t\tthrow new Error( \"Metro 4 requires a window with a document\" );\n" +
            "\t\t\t\t}\n" +
            "\t\t\t\treturn factory( w );\n" +
            "\t\t\t};\n" +
            "\t} else {\n" +
            "\t\tfactory( global );\n" +
            "\t}\n" +
            "\n" +
            "// Pass this if window is not defined yet\n" +
            "} )( typeof window !== \"undefined\" ? window : this, function( window ) {"+
            "\n"+
            "'use strict';\n",

        clean: {
            build: ['build/js', 'build/css', 'build/mif']
        },

        concat: {
            js: {
                options: {
                    banner: '<%= copyright %>' + '<%= banner %>',
                    footer: "\n\nreturn METRO_INIT === true ? Metro.init() : Metro;\n\n});",
                    stripBanners: true,
                    process: function(src, filepath) {
                        // return '\n// Source: ' + filepath + '\n\n' + src;
                        return '\n// Source: ' + filepath + '\n' + src.replace(/(^|\n)[ \t]*('use strict'|"use strict");?\s*/g, '$1');
                        // return '\n// Source: ' + filepath + '\n' + src.replace(/(^|\n)[ \t]*();?\s*/g, '$1');
                    }
                },
                src: [
                    'js/m4q/*.js',
                    'js/*.js',
                    'js/utils/*.js',
                    'js/plugins/*.js'
                ],
                dest: 'build/js/metro.js'
            },
            css: {
                options: {
                    stripBanners: true,
                    banner: '<%= copyright %>'
                },
                src: [
                    'build/css/metro.css',
                    'build/css/metro-colors.css',
                    'build/css/metro-rtl.css',
                    'build/css/metro-icons.css'
                ],
                dest: 'build/css/metro-all.css'
            }
        },

        uglify: {
            options: {
                banner: '<%= copyright %>',
                stripBanners: false,
                sourceMap: true,
                preserveComments: false
            },
            core: {
                src: 'build/js/metro.js',
                dest: 'build/js/metro.min.js'
            }
        },

        less: {
            options: {
                paths: "less/",
                strictMath: false,
                sourceMap: false,
                banner: '<%= copyright %>'
            },
            src: {
                expand: true,
                cwd: "less/",
                src: ["metro.less", "metro-rtl.less", "metro-colors.less", "metro-icons.less"],
                ext: ".css",
                dest: "build/css"
            },
            src_base: {
                expand: true,
                cwd: "less/",
                src: ["metro-base.less"],
                ext: ".css",
                dest: "build/css"
            },
            schemes: {
                expand: true,
                cwd: "less/schemes/",
                src: ["*.less"],
                ext: ".css",
                dest: "build/css/schemes"
            },
            third: {
                expand: true,
                cwd: "less/third-party/",
                src: ["*.less"],
                ext: ".css",
                dest: "build/css/third-party"
            },
            docs: {
                expand: true,
                cwd: "docs/css/",
                src: ["*.less"],
                ext: ".css",
                dest: "docs/css"
            }
        },

        postcss: {
            options: {
                map: false,
                processors: [
                    require('autoprefixer')({
                        browsers: ['last 2 versions']
                    })
                ]
            },
            dist: {
                src: 'build/css/*.css'
            },
            schemes: {
                src: 'build/css/schemes/*.css'
            },
            third: {
                src: 'build/css/third-party/*.css'
            }
        },

        cssmin: {
            src: {
                expand: true,
                cwd: "build/css",
                src: ['*.css', '!*.min.css'],
                dest: "build/css",
                ext: ".min.css"
            },
            schemes: {
                expand: true,
                cwd: "build/css/schemes",
                src: ['*.css', '!*.min.css'],
                dest: "build/css/schemes",
                ext: ".min.css"
            },
            third: {
                expand: true,
                cwd: "build/css/third-party",
                src: ['*.css', '!*.min.css'],
                dest: "build/css/third-party",
                ext: ".min.css"
            }
        },

        copy: {
            fonts: {
                expand: true,
                cwd: 'icons',
                src: '**/*',
                dest: 'build/mif'
            },
            docs: {
                expand: true,
                cwd: 'build',
                src: '**/*',
                dest: 'docs/metro'
            }
        },

        replace: {
            build: {
                options: {
                    patterns: [
                        {
                            match: 'build',
                            replacement: "<%= pkg.build %>"
                        },
                        {
                            match: 'version',
                            replacement: "<%= pkg.version %>"
                        },
                        {
                            match: 'status',
                            replacement: "<%= pkg.version_suffix %>"
                        },
                        {
                            match: 'time',
                            replacement: timestamp
                        }
                    ]
                },
                files: [
                    {
                        expand: true,
                        flatten: true,
                        src: ['build/js/*.js'], dest: 'build/js/'
                    },
                    {
                        expand: true,
                        flatten: true,
                        src: ['build/css/*.css'], dest: 'build/css/'
                    },
                    {
                        expand: true,
                        flatten: true,
                        src: ['docs/metro/js/*.js'], dest: 'docs/metro/js/'
                    }
                ]
            }
        },

        watch: {
            scripts: {
                files: ['js/m4q/*.js', 'js/i18n/*.json', 'js/*.js', 'js/utils/*.js', 'js/plugins/*.js', 'less/*.less', 'less/include/*.less', 'less/third-party/*.less', 'less/schemes/*.less', 'less/schemes/builder/*.less', 'Gruntfile.js'],
                tasks: ['clean',  'less', 'postcss', 'concat', 'uglify', 'cssmin', 'copy', 'replace']
            }
        }
    });

    tasks = ['clean', 'less', 'postcss', 'concat', 'uglify', 'cssmin', 'copy', 'replace'];

    if (watching) {
        tasks.push('watch');
    }

    grunt.registerTask('default', tasks);

};