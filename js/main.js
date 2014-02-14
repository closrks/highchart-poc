requirejs.config({

  // Defines the base URL for Javascript files
  // The URL is relative to the main index.html page
  baseUrl: 'js/',

  // Defines aliases for common Javascript files/modules
  paths: {
    'text': '../vendors/text',
    'underscore': '../vendors/underscore',
    'jquery': '../vendors/jquery-2.0.3',
    'backbone': '../vendors/backbone',
    'handlebars': '../vendors/handlebars-v1.3.0',
    'highcharts': '../vendors/highcharts'
  },

  // Defines dependencies (effectively sets the loading orders)
  shim: {
    'backbone': ['underscore', 'jquery'],
    'app': ['underscore', 'jquery', 'backbone', 'handlebars', 'highcharts']
  }

});

// Activates application module
require(['app'], function () {});