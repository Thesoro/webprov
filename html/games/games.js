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

  $scope.tagButton = function(tag) {
    $scope.view = 'tags'
    $scope.addTag(tag);
  }
  $scope.getStyle = function(index) {

    var x = ((index+1)%$scope.style.length)-1
    if (x == -1) { x = $scope.style.length-1}
    x = $scope.style[x]
    return x
  }
  $scope.chooseGame = function(name) {
    $location.url("/games/"+name);
  }

  $scope.searchbar = ''
  $scope.chosentags = {}
  $scope.history = []


//turns strings into arrays, keeps arrays as they are
  $scope.stringtoArr = function(thing) {
    if (thing[0].length == 1) {
      var a = []
      a.push(thing)
      thing = a
    }
    return thing
  }

  $scope.randomGame = function() {
    $scope.chosengame = $scope.games[Math.floor(Math.random() * ($scope.games.length))];
    $scope.cleanupGame();
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

  $scope.removeDuplicates = function(list) {
    //check for duplicates
    var dupes = []
    for (var l in list) {
      if (list.indexOf(list[l]) != l) {
        dupes.push(l)
      }
    }
    var newlist = []
    for (var l in list) {
      if (dupes.indexOf(l) == -1) {
        newlist[l] = list[l]
      }
    }
    return list
  }

  $scope.addCookie = function(game,cookie) {
    var hist = $cookies.get('webProv'+cookie)
    if (hist) {
      hist = hist.split('|')
    } else {
      hist = []
    }
    while (hist.length >= 24) {
      hist.pop()
    }
    if (hist.indexOf(game) == -1) {
      hist.unshift(game)
    }
    hist = $scope.removeDuplicates(hist)
    hist = hist.join('|')

    // Setting a cookie
    $scope.saveCookie(hist,cookie);
    $scope.getHistory();
    $scope.getFavorites();
  }

  $scope.saveCookie = function(string, type) {
    var expireDate = new Date();
    expireDate.setYear(expireDate.getFullYear() + 1);
    $cookies.put('webProv'+type, string, {'expires': expireDate});
  }

  $scope.removeFav = function(game) {
    $scope.getFavorites();
    var i = $scope.favorites.indexOf(game)
    $scope.favorites.splice(i,1)
    $scope.saveCookie($scope.favorites.join('|'), "Favorites")
    $scope.getFavorites();

  }
  $scope.getHistory = function() {
    $scope.history = []
    var f = $cookies.get('webProvHistory')
    if (f) {
      $scope.history = f.split('|')
    }
  }


  $scope.getFavorites = function() {
    $scope.favorites = []
    var f = $cookies.get('webProvFavorites')
    if (f) {
      $scope.favorites = f.split('|')
    }
  }

  $scope.buttonStyle = function(value) {
    return "btn-info"
  }
  $scope.addCount = function() {
    return "unread-count"
  }
  $scope.addTag = function(key) {
    $scope.chosentags[key] = true
    $scope.getTags()
  }

  $scope.removeTag = function(key) {
    delete $scope.chosentags[key]
    $scope.getTags()
  }

  $scope.shuffleArray = function(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
  }

  $scope.cleanupGame = function() {
    var v = $scope.chosengame.variations
    // $log.info(v['variant'][0].length)
    //to check if our 'variant' object is a string or an array, we check the length of the first index
    //undefined means it's a list of @name/#text objects, so we rearrange in that case too
    if (v && (v['variant'][0].length > 1 || v['variant'][0].length === undefined)) {
      $scope.chosengame.variations = v['variant']
    }
    //if it only has one tag, angular tries to iterate through the string. we stop it here.
    $scope.chosengame.tags.tag = $scope.stringtoArr($scope.chosengame.tags.tag)
    if ($scope.chosengame.aliases){
      $scope.chosengame.aliases.alias = $scope.stringtoArr($scope.chosengame.aliases.alias)
    }
    if ($scope.chosengame.relations){
      $scope.chosengame.relations.relation = $scope.stringtoArr($scope.chosengame.relations.relation)
    }
  }
  var initPage = function() {
    $scope.taglist = {}
    $scope.chosentags = {}
    $scope.emptytags = {}
    $scope.chosengame = null
    $scope.view = false
    $scope.getHistory();
    $scope.getFavorites();
    $scope.style = ["btn-primary", "btn-info","btn-success","btn-warning","btn-danger"]
    $scope.shuffleArray($scope.style)

    if (!$scope.games) {
      $http.get("/api/game/all").success(function (response) {
          $scope.games = response
          if ($routeParams.entityid) {
            $scope.view = 'game'
            if ($routeParams.entityid == "random") {
              $scope.chosengame = true
              $scope.randomGame();
            } else if ($routeParams.entityid == "tags") {
              $scope.getTags();
              $scope.view = 'tags'
            } else if ($routeParams.entityid == "history") {
              $scope.view = "history"
            } else if ($routeParams.entityid == "favorites") {
              $scope.view = "favorites"
            } else {
              for (var g in $scope.games) {
                if ($scope.games[g].name.toLowerCase() == $routeParams.entityid.toLowerCase()) {
                  $scope.chosengame = $scope.games[g]
                }
              }
              $scope.addCookie($routeParams.entityid,"History")
            }

            if ($scope.chosengame) {
              $scope.cleanupGame();
            }
          } else {
            $scope.view = 'all'
          }
        })
      }
    }
  initPage();
}]);
