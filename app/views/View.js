define(['backbone', 'underscore', 'text!templates/view.html'], function(Backbone, _, Template) {

    var View = Backbone.View.extend({

    	el: '.content',

    	template: _.template(Template),

        render: function(data) {
            this.$el.html(this.template(data));
        },
    });

    return View;
});