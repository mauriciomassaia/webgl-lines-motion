module.exports = function (grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		copy: {
			main: {
				files: [
					{expand: true, cwd: 'src/', src: 'js/libs/*.js', dest: 'build/'}
				]
			}
		},
		uglify: {
			 options: {
				mangle: {
					except: ['Zepto']
				}
			},
			build: {
				src: 'src/js/*.js',
				dest: 'build/js/scripts.min.js'
			}
		},
		imagemin : {
			dyanmic: {
				files: [{
					expand: true,
					cwd: 'src/images/',
					src: ['*.{jpg,png,gif}'],
					dest: 'build/images/'
				}]
			}
		},
		cssmin: {
			combine: {
				files: {
					"build/css/style.min.css": [
						"src/css/normalize.css", 
						"src/css/main.css", 
						"src/css/nav.css"
					]
				}
			}
		},
		htmlbuild: {
			dist: {
				src: 'src/index.html',
				dest: 'build/',
				options: {
					beautify: true,
					relative: true,
					scripts: {
						min: 'build/js/scripts.min.js',
						libs: 'build/js/libs/*.js'
					},
					styles: {
						min: 'build/css/style.min.css'
					}
				}
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-contrib-imagemin');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-html-build');
	
	grunt.registerTask('default', ['copy', 'uglify', 'cssmin', 'imagemin', 'htmlbuild']);
	
	grunt.registerTask('css', ['cssmin']);
	grunt.registerTask('img', ['imagemin']);
	grunt.registerTask('js', ['uglify']);
	grunt.registerTask('html', ['copy', 'htmlbuild']);
}