'use strict';

angular.module('myApp.other', ['ngRoute'])


.controller('otherCtrl', ['$scope','$http','$location','$log','$routeParams','$cookies'
  ,function($scope,$http,$location,$log,$routeParams,$cookies) {
  $scope.view = ''
  $scope.manysub = false
  $scope.games = false
  $scope.selectedgame = null
  $scope.isvariant = true
  $scope.submission = {'isvariant':true}
  $scope.relatedgames = {}
  $scope.recentrel = false
  $scope.taglist = {}
  $scope.relatedtags = {}

  $scope.delCookie = function(kind) {
    $cookies.remove('webProv'+kind);
    if (kind == "History") { $scope.delhist = true}
    if (kind == "Favorites") { $scope.delfavs = true}
  }
  $scope.changeView = function(view) {
    $scope.view = view
  }
  $scope.selectGame = function(game) {
    $scope.selectedgame = game
  }
  $scope.getGames = function() {
    $http.get("/api/game/all").success(function (response) {
      $scope.games = response
      $scope.getTags();
    })
  }

  $scope.stringtoArr = function(thing) {
    if (thing[0].length == 1) {
      var a = []
      a.push(thing)
      thing = a
    }
    return thing
  }

  $scope.getTags = function() {
    $scope.taglist = {}
    for (var gm in $scope.games) {
      var t = $scope.stringtoArr($scope.games[gm].tags.tag)
      for (var i in t) {
        $scope.taglist[t[i]] = t[i]
      }
    }
  }


  $scope.toggleRel = function(game) {
    if ($scope.relatedgames[game.name]) {
      $scope.relatedgames[game.name] = false
    } else {
      $scope.relatedgames[game.name] = true
      $scope.recentrel = game
    }
  }

  $scope.activeTable = function(game) {
    if (game == $scope.selectedgame || ($scope.selectedgame == 'none' && $scope.relatedgames[game.name])) {
      return {'color':'#ffffff','background-color':'#337ab7'}
    } else {
      return {}
    }
  }
  $scope.activeTag = function(tag) {
    if ($scope.relatedtags[tag]) {
      return {'color':'#ffffff','background-color':'#337ab7'}
    } else {
      return {}
    }
  }

  $scope.toggleTag = function(tag) {
    if ($scope.relatedtags[tag]) {
      $scope.relatedtags[tag] = false
    } else {
      $scope.relatedtags[tag] = true
    }
  }

  $scope.submitGame = function(sub) {

  }

  var initPage = function() {
    $scope.view = $routeParams.entityid
    $scope.delhist = false
    $scope.delfavs = false
    $scope.getGames();
  }
  initPage();
}]);
