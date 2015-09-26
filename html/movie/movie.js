'use strict';

angular.module('myApp.movie', ['ngRoute'])

// .config(['$routeProvider', function($routeProvider) {
//   $routeProvider.when('/movie', {
//     templateUrl: 'movie/movie.html',
//     controller: 'movieCtrl'
//   });
// }])


.controller('movieCtrl', ['$scope','$http','$location','$log'
  ,function($scope,$http,$location,$log) {

  $scope.getMovie = function() {
    var num = Math.floor(Math.random() * 400)
    $http.get("http://api.themoviedb.org/3/discover/movie?vote_count.gte=200&page="+num+"&api_key=fd1342f8e75b4a2e8a1b621e4d3620e0").success(function (response) {
      var x = Math.floor(Math.random() * 20)
      $scope.movie = response.results[x]
      $log.info($scope.movie)
      $log.info(response.results)
      $log.info(x)
      if (!$scope.movie) {
        $scope.getMovie();
      }
    }).error(function(re) {
      $scope.getMovie();
    })
  }

  $scope.ovrView = function() {
    if ($scope.showoverview) {
      return "glyphicon-minus"
    } else {
      return "glyphicon-plus"
    }
  }

  var initPage = function() {
    $scope.showoverview = false
    $scope.getMovie();
  }
  initPage();
}]);
