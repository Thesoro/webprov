'use strict';

// Declare app level module which depends on views, and components
angular.module('myApp', [
  'ngRoute',
  'myApp.main',
  'myApp.games',
  'myApp.version',
  'myApp.code',
  'myApp.words'
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
  .otherwise({redirectTo: '/main'});
}]);
