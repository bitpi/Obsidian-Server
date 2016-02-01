module.exports = function(grunt) {

    grunt.initConfig({
        ts: {
            options: {
                module: 'commonjs',
                target: 'es5'
            },
            default: {
                src: './src/**/*.ts',
                outDir: './build'
            }
        },
        file_append: {
            default_options: {
                files: [{
                    prepend: '#!/usr/bin/env node\r\n',
                    input: './build/obsidian.js'
                }]
            }
        },
        clean: {
            build: ['build']
        }
    });

    grunt.loadNpmTasks('grunt-ts');
    grunt.loadNpmTasks('grunt-file-append');
    grunt.loadNpmTasks('grunt-contrib-clean');

    grunt.registerTask('build', [
        'clean:build',
        'ts',
        'file_append'
    ]);

};