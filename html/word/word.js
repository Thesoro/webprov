'use strict';

angular.module('myApp.word', ['ngRoute'])

// .config(['$routeProvider', function($routeProvider) {
//   $routeProvider.when('/word', {
//     templateUrl: '/html/word/word.html',
//     controller: 'wordCtrl'
//   });
// }])

.controller('wordCtrl', ['$scope','$http','$routeParams',
  function($scope,$http,$routeParams) {



  var initPage = function() {
    $http.get("/api/word/"+$routeParams.entityid).success(function (response) {
      $scope.w = response
    })
  }
  initPage();

}]);
