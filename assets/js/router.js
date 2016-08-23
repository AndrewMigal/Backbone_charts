/**
 * Created by migel on 22.08.16.
 */
var app = app || {};

$(function() {
  var AppRouter = Backbone.Router.extend({
    routes: {
      // Define some URL routes
      '': 'showProjects'
    }
  });

  app.router = new AppRouter;

  app.router.on('route:showProjects', function(){});

  Backbone.history.start();
});

