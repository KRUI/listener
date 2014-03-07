define(['backbone', 'underscore', 'text!templates/view.html'], function(Backbone, _, Template) {

    var View = Backbone.View.extend({

      el: '.content',

      template: _.template(Template),
 
      render: function(data) {
        this.$el.html(this.template(data));
        this.loadCurrentSong();
        this.loadPlays();
      },

      loadCurrentSong: function() {

        var latestUrl = "http://staff.krui.fm/api/playlist/main/latest.json",
          that = this;

        $.ajax({

          url: latestUrl,

          success: function(results) {
            var dj = results.user.firstname + results.user.lastname,
              artist = results.song.artist,
              track = results.song.name;

            that.$('h1')
              .text(dj + " is playing some filthy jams");
            that.$('h2')
              .text(artist + " - " + track);

            that.loadArtistImage(artist);
          },

          error: function(xhr,status, err) {
            console.log(err);
          }

        });
      },

      loadArtistImage: function(artist) {

        var imageUrl = "http://developer.echonest.com/api/v4/artist/images?" +
          "api_key=" + "UOWZEQZDWKY7GO4CO" + "&format=jsonp" +
          "&results=10" + "&start=0" + "&license=unknown" + 
          "&name=" + artist.split(' ').join('+');

        $.ajax({
          type: 'GET',
          async: 'false',
          url: imageUrl,
          dataType: 'jsonp',
          jsonpCallback: 'success',
          contentType: 'application/json',
          success: function(json) {
            console.log(json);
          },

          error: function(xhr, status, err) {
            console.log(err);
          }

        });
      },

      loadPlays: function() {
        var playsUrl = "http://staff.krui.fm/api/playlist/main/items.json?limit=50";

        $.ajax({

          url: playsUrl,

          success: function(results) {
            console.log(results);
          },

          error: function(xhr, status, err) {
            console.log(err);
          }

        });
      },

    });

    return View;
});