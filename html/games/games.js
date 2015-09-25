'use strict';

angular.module('myApp.games', ['ngRoute'])

// .config(['$routeProvider', function($routeProvider) {
//   $routeProvider.when('/games', {
//     templateUrl: 'games/games.html',
//     controller: 'gamesCtrl'
//   });
// }])

.controller('gamesCtrl', ['$scope','$http','$routeParams','$log','$location',
  function($scope,$http,$routeParams,$log,$location) {

  $scope.chooseGame = function(name) {
    $location.url("/games/"+name);
  }
  $scope.searchbar = ''
  var initPage = function() {
    $scope.chosengame = null
    $http.get("/game/all").success(function (response) {
        $scope.games = response
        if ($routeParams.entityid) {
          if ($routeParams.entityid == "random") {
            $scope.chosengame = $scope.games[Math.floor(Math.random() * ($scope.games.length))];
          } else {
            for (var g in $scope.games) {
              if ($scope.games[g].name.toLowerCase() == $routeParams.entityid.toLowerCase()) {
                $scope.chosengame = $scope.games[g]
              }
            }
          }

          var v = $scope.chosengame.variations
          // $log.info(v['variant'][0].length)
          //to check if our 'variant' object is a string or an array, we check the length of the first index
          //undefined means it's a list of @name/#text objects, so we rearrange in that case too
          if (v && (v['variant'][0].length > 1 || v['variant'][0].length === undefined)) {
            $scope.chosengame.variations = v['variant']
          }
          //if it only has one tag, angular tries to iterate through the string. we stop it here.
          if ($scope.chosengame.tags.tag[0].length === 1) {
            var a = []
            a.push($scope.chosengame.tags.tag)
            $scope.chosengame.tags.tag = a

          }
        }
      })

  }
  initPage();
}]);
