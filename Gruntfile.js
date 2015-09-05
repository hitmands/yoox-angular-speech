module.exports = function(grunt) {
  'use strict';

  // TASKS
  grunt.task.registerTask('deploy', [
    'frontend'
  ]);

  grunt.task.registerTask('deployProd', [
    'shell:deployProduction'
  ]);



  /* *** INITIALIZE CONFIGURATION *** */
  var _ = require('lodash');
  var ENV_PRODUCTION = /^production$/i.test(grunt.option('ENV'));
  var pkg = grunt.file.readJSON('./package.json');
  var frontendConfigs = require('./config/default.frontend.js');
  if(ENV_PRODUCTION) {
    frontendConfigs = _.merge(frontendConfigs, require('./config/production.frontend.js'));
    grunt.log.ok('Grunt Running in PRODUCTION environment');
  }
  require('load-grunt-config')(grunt, {
    init: true,
    jitGrunt: {
      staticMappings: {
        "ngtemplates" : "grunt-angular-templates"
      }
    },
    data: {
      "pkg" : pkg,
      "frontend" : frontendConfigs,
      "ngFiles" : require('./grunt/helpers/NgFolderingPattern.js')(frontendConfigs)
    }
  });

  // Private Tasks
  grunt.task.registerTask('angularWatch', [
    'newer:uglify:development',
    'newer:ngAnnotate:modules',
    'newer:jshint:frontend'
  ]);

  grunt.task.registerTask('sassWatch', [
    'newer:sass:development'
  ]);

  grunt.task.registerTask('angular', [
    'uglify:development',
    'ngAnnotate',
    'jshint',
    'ngtemplates',
    'uglify:production',
    'angularI18n'
  ]);

  grunt.task.registerTask('angularI18n', [
    'shell:i18nXslxToJson'
  ]);

  grunt.task.registerTask('frontend', [
    'clean:frontendPublicDir',
    'angular',
    'sass',
    'concat',
    'frontendIncludes'
  ]);

};