'use strict';

// Declare app level module which depends on views, and components
angular.module('myApp', [
  'ngRoute',
  'myApp.main',
  'myApp.games',
  'myApp.version',
  'myApp.word',
  'myApp.movie'
]).
config(['$routeProvider', function($routeProvider) {
  $routeProvider
  .when("/main", {
    controller: "mainCtrl",
    title: "main",
    templateUrl: "/html/main/main.html"
  })
  .when("/games/:entityid?", {
    controller: "gamesCtrl",
    title: "games",
    templateUrl: "/html/games/games.html"
  })
  .when("/games", {
    controller: "gamesCtrl",
    title: "games",
    templateUrl: "/html/games/games.html"
  })
  .when("/word/:entityid?", {
    controller: "wordCtrl",
    title: "word",
    templateUrl: "/html/word/word.html"
  })
  .when("/movie/", {
    controller: "movieCtrl",
    title: "movie",
    templateUrl: "/html/movie/movie.html"
  })
  .otherwise({redirectTo: '/main'});
}]);
