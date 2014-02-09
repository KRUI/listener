define([
    'backbone',
    'views/View'
	], function(Backbone, View) {

	var Router = Backbone.Router.extend({

		routes: {
			"": "index"
		}, 

		index: function() {
			var view = new View();
			view.render();
		}

	});

	return Router;
});
