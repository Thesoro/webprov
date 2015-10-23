'use strict';

angular.module('myApp.other', ['ngRoute'])


.controller('otherCtrl', ['$scope','$http','$location','$log','$routeParams','$cookies'
  ,function($scope,$http,$location,$log,$routeParams,$cookies) {


  $scope.delCookie = function(kind) {
    $cookies.remove('webProv'+kind);
    if (kind == "History") { $scope.delhist = true}
    if (kind == "Favorites") { $scope.delfavs = true}
  }
  $scope.changeView = function(view) {
    $scope.view = view
  }
  $scope.selectGame = function(game) {
    $scope.submission.selectedgame = game
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
    if ($scope.submission.relatedgames[game.name]) {
      $scope.submission.relatedgames[game.name] = false
    } else {
      $scope.submission.relatedgames[game.name] = true
      $scope.recentrel = game
    }
  }

  $scope.activeTable = function(game) {
    if (game == $scope.submission.selectedgame || ($scope.submission.selectedgame == 'none' && $scope.submission.relatedgames[game.name])) {
      return {'color':'#ffffff','background-color':'#337ab7'}
    } else {
      return {}
    }
  }
  $scope.activeTag = function(tag) {
    if ($scope.submission.relatedtags[tag]) {
      return {'color':'#ffffff','background-color':'#337ab7'}
    } else {
      return {}
    }
  }

  $scope.toggleTag = function(tag) {
    if ($scope.submission.relatedtags[tag]) {
      $scope.submission.relatedtags[tag] = false
    } else {
      $scope.submission.relatedtags[tag] = true
    }
  }

  $scope.submitGame = function(sub) {
    $log.info(sub)
    var ltag = $scope.submission.lengthtag
    var ttag = $scope.submission.typetag
    if (ltag) { $scope.submission.relatedtags[ltag] = true}
    if (ttag) { $scope.submission.relatedtags[ttag] = true}

    $scope.submission.selectedgame = $scope.submission.selectedgame.name
    $http.post("/api/submit/",sub)
    initPage(true);
  }

  var initPage = function(thanks) {
    $scope.submission = {'isvariant':true}
    $scope.view = ''
    $scope.manysub = false
    $scope.games = false
    $scope.isvariant = true
    $scope.submission.selectedgame = null
    $scope.submission.relatedgames = {}
    $scope.recentrel = false
    $scope.taglist = {}
    $scope.submission.relatedtags = {}
    $scope.view = $routeParams.entityid
    $scope.delhist = false
    $scope.delfavs = false
    $scope.getGames();
    $scope.thanks = thanks
  }
  initPage();
}]);
