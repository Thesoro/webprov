'use strict';

angular.module('myApp.main', ['ngRoute'])

// .config(['$routeProvider', function($routeProvider) {
//   $routeProvider.when('/main', {
//     templateUrl: 'main/main.html',
//     controller: 'mainCtrl'
//   });
// }])

.controller('mainCtrl', ['$scope','$http','$location','$log'
  ,function($scope,$http,$location,$log) {

  $scope.gamemenu = [
                        {name:"Browse", glyph:"search", link:"games"},
                        {name:"Favorites", glyph:"star-empty", link:"games/favorites"},
                        {name:"History", glyph:"time", link:"games/history"},
                        {name:"Random", glyph:"random", link:"games/random"},
                        {name:"Tags", glyph:"tag", link:"games/tags"},
                     ]
  $scope.suggestionmenu = [
                        {name:"Noun", glyph:"", letter:"n.", link:"word/noun"},
                        {name:"Verb", glyph:"", letter:"v.", link:"word/verb"},
                        {name:"Adjective", glyph:"", letter:"a.", link:"word/adj"},
                        {name:"Title", glyph:"", letter:"M.", link:""},
                        {name:"Two-too-to", glyph:"", letter:"T.t.t", link:"word/ttt"},
                        {name:"Movies", glyph:"film", link:"movie"},
                     ]
  $scope.moremenu = [
                        {name:"About", glyph:"info-sign", link:""},
                        {name:"Submit Game", glyph:"envelope", link:""},
                        {name:"Settings", glyph:"cog", link:""},
                     ]
  $scope.menus = [
                  {name:"Games", 'list':$scope.gamemenu},
                  {name:"Suggestions", 'list':$scope.suggestionmenu},
                  {name:"More", 'list':$scope.moremenu},
                  ]
  $scope.goToPage = function(page) {
    $location.url("/"+page)
  }
  var initPage = function() {
    $http.get("/api/game/all").success(function (response) {
      $scope.games = response
    })
  }
  initPage();
}]);
