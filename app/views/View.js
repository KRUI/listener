define(['backbone', 'underscore', 'text!templates/view.html'], function(Backbone, _, Template) {

    var View = Backbone.View.extend({

      el: '.content',

      template: _.template(Template),
 
      render: function(data) {
        this.$el.html(this.template(data));
        var runCount = 0, maxRunCount = 1440, that = this; // Keeps refreshing for a max of 1 day 
        function refresh() {
          runCount++;
          that.loadCurrentSong();
          if(runCount > maxRunCount) clearInterval(timerId);
        }
        var timerId = setInterval(refresh, 60000); // run every 30 sec.
        refresh(); // Also run right now
      },

      loadCurrentSong: function() {
        console.log("Loading current song");
        var latestUrl = "http://staff.krui.fm/api/playlist/main/latest.json",
          that = this;

        $.ajax({

          url: latestUrl,

          success: function(results) {
            var dj = results.user.firstname + results.user.lastname,
              artist = results.song.artist,
              track = results.song.name;

            that.$('h1.current.dj')
              .text(dj);
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
          "&name=" + artist.split(' ').join('+'),
          that = this;

        $.ajax({
          type: 'GET',
          async: 'false',
          url: imageUrl,
          dataType: 'jsonp',
          jsonpCallback: 'success',
          contentType: 'application/json',

          success: function(obj) {
            var images = obj["response"]["images"],
              randomImage = images[Math.floor(Math.random() * images.length)];
            $('body').css('background-image', 'url(' + randomImage["url"] + ')');
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
        });
      },
    });

    return View;
});