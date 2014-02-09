require.config({
  baseUrl: 'app/',

  paths: {
    jquery: "../components/jquery/jquery",
    underscore: "../components/underscore/underscore",
    backbone: "../components/backbone/backbone",
    text: "../components/requirejs-text/text",
    player: "../JAweSomePlayer/js/player"
  },

  shim: {
  	underscore: {
  		exports: "_"
  	},
    backbone: {
      deps: ["jquery", "underscore"],
      exports: "Backbone"
    }
  }
});


require([
  'jquery', 
  'backbone', 
  'router'
  ], function($, Backbone, Router) {

  	var router = new Router();

  	Backbone.history.start({ pushState: true });
});
