'use strict';

angular.module('myApp.games', ['ngRoute','ngCookies'])

// .config(['$routeProvider', function($routeProvider) {
//   $routeProvider.when('/games', {
//     templateUrl: 'games/games.html',
//     controller: 'gamesCtrl'
//   });
// }])

.controller('gamesCtrl', ['$scope','$http','$routeParams','$log','$location','$cookies',
  function($scope,$http,$routeParams,$log,$location,$cookies) {

  $scope.chooseGame = function(name) {
    $location.url("/games/"+name);
  }
  $scope.searchbar = ''
  $scope.chosentags = {}
//turns strings into arrays, keeps arrays as they are
  $scope.stringtoArr = function(thing) {
    if (thing[0].length == 1) {
      var a = []
      a.push(thing)
      thing = a
    }
    return thing
  }


  $scope.filterByTags = function(item) {
    var out = false
    var tgs = $scope.stringtoArr(item.tags.tag)
    var tagkeys = Object.keys($scope.chosentags)
    if (tagkeys.length) {
      var matchall = true
      for (var tag in tagkeys) {
        if (tgs.indexOf(tagkeys[tag]) == -1) {
          matchall = false
        }
      }
      out = matchall
    } else {
      out = true
    }

    return out
  }

  $scope.getTags = function() {
    $scope.taglist = {}
    for (var gm in $scope.games) {
      var t = $scope.stringtoArr($scope.games[gm].tags.tag)

      var chosematch = true
      var tagkeys = Object.keys($scope.chosentags)
      if (tagkeys.length) {
        for (var x in tagkeys) {
          if (t.indexOf(tagkeys[x]) == -1) {
            chosematch = false
          }
        }
      }
      if (chosematch) {
        for (var i in t) {
            if ($scope.taglist[t[i]]) {
              $scope.taglist[t[i]] += 1
            } else {
              $scope.taglist[t[i]] = 1
            }
        }
      }
    }
  }

  $scope.buttonStyle = function(value) {
    return "btn-info"
  }

  $scope.addTag = function(key) {
    $scope.chosentags[key] = true
    $scope.getTags()
  }

  $scope.removeTag = function(key) {
    delete $scope.chosentags[key]
    $scope.getTags()
  }
  var initPage = function() {
    var expireDate = new Date();
    expireDate.setYear(expireDate.getFullYear() + 1);
    // Setting a cookie
    $cookies.put('myFavorite', 'oatmeal', {'expires': expireDate});

    $log.info($scope.a)
    $scope.taglist = {}
    $scope.chosentags = {}
    $scope.emptytags = {}
    $scope.chosengame = null
    $scope.view = false
    if (!$scope.games) {
      $http.get("/api/game/all").success(function (response) {
          $scope.games = response
          if ($routeParams.entityid) {
            $scope.view = 'game'
            if ($routeParams.entityid == "random") {
              $scope.chosengame = $scope.games[Math.floor(Math.random() * ($scope.games.length))];
            } else if ($routeParams.entityid == "tags") {
              $scope.getTags();
              $scope.view = 'tags'
            } else {
              for (var g in $scope.games) {
                if ($scope.games[g].name.toLowerCase() == $routeParams.entityid.toLowerCase()) {
                  $scope.chosengame = $scope.games[g]
                }
              }
            }

            if ($scope.chosengame) {
              var v = $scope.chosengame.variations
              // $log.info(v['variant'][0].length)
              //to check if our 'variant' object is a string or an array, we check the length of the first index
              //undefined means it's a list of @name/#text objects, so we rearrange in that case too
              if (v && (v['variant'][0].length > 1 || v['variant'][0].length === undefined)) {
                $scope.chosengame.variations = v['variant']
              }
              //if it only has one tag, angular tries to iterate through the string. we stop it here.
              $scope.chosengame.tags.tag = $scope.stringtoArr($scope.chosengame.tags.tag)
            }
          } else {
            $scope.view = 'all'
          }
        })
      }
    }
  initPage();
}]);
