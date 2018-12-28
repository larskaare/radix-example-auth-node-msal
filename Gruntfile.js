module.exports = function(grunt) {

    grunt.initConfig({
        eslint: {
            target: [
                'Gruntfile.js',
                'bin/**/*.js',
                'config/**/*.js',
                'routes/**/*.js',
                'src/**/*.js',
                'test/**/*.js'
            ]
        },
        watch: {
            test: {
                files: ['<%= eslint.target %>'],
                tasks: ['eslint','test']
            },
            watch: {
                files: ['<%= eslint.target %>'],
                tasks: ['eslint']
            }
        },
        mochacli: {
            options: {
                reporter: 'tap',
                bail: true
            },
            all: ['test/*.js']
        },
        run: {
            audit: {
                exec: 'npm audit'
            },
            docker: {
                cmd: 'docker',
                args: [
                    'build',
                    '-t',
                    'radixauth',
                    '.'
                ]
            }
        }
    });
  
    grunt.loadNpmTasks('grunt-eslint');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-mocha-cli');
    grunt.loadNpmTasks('grunt-run');
  
    grunt.registerTask('lint',['eslint']);
    grunt.registerTask('test',['mochacli']);
    grunt.registerTask('audit',['run:audit']);
    grunt.registerTask('docker',['run:docker']);
    grunt.registerTask('default', ['watch:watch']);
  
};
