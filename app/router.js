define([
    'views/View'
	], function(View) {

	var Router = Backbone.Router.extend({

		routes: {
			"": "index"
		}, 

		index: function() {
			var view = new View();
			view.render();
		}

	});

	new Router();
});
