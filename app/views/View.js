define(['backbone', 'underscore', 'text!templates/view.html', 'helpers/blur.js'], function(Backbone, _, Template, Blur) {

    var View = Backbone.View.extend({

      el: '.content',

      template: _.template(Template),
 
      render: function(data) {
        this.$el.append(this.template(data));
        var runCount = 0, 
          maxRunCount = 1440, // Keeps refreshing for a max of 1 day 
          that = this;

        function refresh() {
          runCount++;
          that.loadCurrentSong();
          if(runCount > maxRunCount) {
            clearInterval(timerId);
          }
        }
        var timerId = setInterval(refresh, 60000); // run every 60 sec.
        refresh(); // Also run right now
      },

      loadCurrentSong: function() {
        var latestUrl = "http://staff.krui.fm/api/playlist/main/latest.json",
          that = this;

        $.ajax({
          url: latestUrl,
          success: function(results) {
            var latestSongTime = Date.parse(results.song.time),
              now = new Date().getTime(),
              latestSongMinutesSinceNow = ((now - latestSongTime) / 60000);

            if (latestSongMinutesSinceNow > 12) {
              that.handleInactiveDJ();
              return;
            }
            
            var dj = results.user.firstname + " " + results.user.lastname,
              artist = results.song.artist, 
              track = results.song.name;

            that.$('h1.current.dj, .glyphicon-headphones')
              .show();
            that.$('h1.current.dj')
              .text(dj);
            that.$('h2')
              .text(artist + " - " + track);

            that.loadArtistImage(artist);
          }
        });
      },

      handleInactiveDJ: function() {
        this.$('h1.current.dj, .glyphicon-headphones')
          .hide();
        this.$('h2.current.song')
          .text("Iowa City's Sound Alternative");
        this.$('.recentlyPlayed')
          .css('top', '-100px');
        this.$('.blurMask, .blurMask .blur')
          .css('height', '100px');
        this.setJapanBackground();
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
            if (obj.response.status.message !== "Success") {
              console.log(obj);
              return;
            }
            var images = obj.response.images;
            if (images.length > 0) {
              var randomImage = images[Math.floor(Math.random() * images.length)];
              $('body, .blur')
                .css('background-image', 'url(' + randomImage["url"] + ')'); 
            } else {
              that.setJapanBackground();
            }
          }
        });
      },

      setJapanBackground: function() {
        var japan = "http://krui.fm/wordpress/wp-content/themes/krui/images/bg_japan.jpg";
        $('body, .blur')
          .css('background-image', 'url(' + japan + ')')
          .addClass('japan');
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