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
    $http.get("https://api.themoviedb.org/3/movie/latest?api_key=fd1342f8e75b4a2e8a1b621e4d3620e0").success(function (response) {
      var max = response.id
      var queryid = Math.floor(Math.random() * max)
      $http.get("https://api.themoviedb.org/3/movie/"+queryid+"?api_key=fd1342f8e75b4a2e8a1b621e4d3620e0").success(function (re) {
        $scope.movie = re
      }).error(function(re) {
        $scope.getMovie();
      })
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
