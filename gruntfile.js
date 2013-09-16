module.exports = function (grunt) {
	"use strict";

	grunt.initConfig({

		pkg: grunt.file.readJSON('bower.json'),

		language: grunt.option('lang') || 'en',

		meta: {
			banner: '/**\n * <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
				'<%= grunt.template.today("yyyy-mm-dd") %>\n' +
				' * <%= pkg.homepage %>\n' +
				' * Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
				' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %>\n */\n'
		},

		build_dir: 'build',

		lib_files: {

			core: [
				'src/onbeforeunload.js',
				'src/onbeforeunloadDirective.js'
			],

			test: ['test/**/*.js']
		},

		watch: {

			scripts: {
				files: ['gruntfile.js', '<%= lib_files.core %>', '<%= lib_files.test %>'],
				tasks: ['jshint:all', 'karma:unit']
			},

			livereload: {
				options: {
					livereload: true
				},
				files: ['src/**/*.js', 'demo/*'],
				tasks: ['jshint', 'karma:unit', 'concat', 'copy:demo']
			}
		},

		jshint: {

			options: {
				jshintrc: '.jshintrc'
			},

			all: ['gruntfile.js', '<%= lib_files.core %>', '<%= lib_files.test %>'],

			core: {
				files: {
					src: ['<%= lib_files.core %>']
				}
			},

			test: {
				files: {
					src: ['<%= lib_files.test %>']
				}
			}
		},

		concat: {
			banner: {
				options: {
					banner: '<%= meta.banner %>'
				},
				src: '<%= concat.core.dest %>',
				dest: '<%= concat.core.dest %>'
			},

			core: {
				src: ['<%= lib_files.core %>'],
				dest: '<%= build_dir %>/angular-onbeforeunload.js'
			}
		},

		uglify: {
			core: {
				files: {
					'<%= build_dir %>/angular-onbeforeunload.min.js': '<%= concat.core.dest %>'
				}
			}
		},

		copy: {
			demo: {
				files: [
					{
						src: 'angular-translate.js',
						dest: 'demo/js/',
						cwd: 'dist/',
						expand: true
					}
				]
			}
		},

		karma: {
			unit: {
				configFile: 'karma.conf.js',
				singleRun: true
			}
		},

		ngmin: {

			core: {
				src: '<%= concat.core.dest %>',
				dest: '<%= concat.core.dest %>'
			}
		}
	});


	grunt.registerTask('default', ['jshint:all', 'karma']);
	grunt.registerTask('test', ['karma']);

	grunt.registerTask('build', [
		'jshint:all',
		'karma',
		'build:core'
	]);

	grunt.registerTask('build:core', [
		'jshint:core',
		'concat:core',
		'ngmin:core',
		'concat:banner',
		'uglify:core'
	]);

	// For development purpose.
	grunt.registerTask('dev', ['jshint', 'karma:unit', 'concat', 'copy:demo', 'watch:livereload']);

	require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);
};