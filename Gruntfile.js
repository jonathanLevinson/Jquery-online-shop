module.exports = function(grunt) {
    grunt.initConfig({
        //tasks
        jshint: { //{ all: ['*.js']}
            client: {
                files: {src: ['public/**/*.js']}
            },
            server: {
                file: {src: ['model/**/*.js', 'routers/**/*.js']}
            }
        }
    });

    // activate jshint
    grunt.loadNpmTasks('grunt-contrib-jshint');
};