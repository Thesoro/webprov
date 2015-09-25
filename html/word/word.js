'use strict';

angular.module('myApp.word', ['ngRoute'])

// .config(['$routeProvider', function($routeProvider) {
//   $routeProvider.when('/word', {
//     templateUrl: '/html/word/word.html',
//     controller: 'wordCtrl'
//   });
// }])

.controller('wordCtrl', ['$scope','$http','$routeParams','$log',
  function($scope,$http,$routeParams,$log) {

  $scope.wordlist = {}
  $scope.wordtype = ''

  var initPage = function() {
    $scope.wordtype = $routeParams.entityid
    if ($scope.wordtype == "ttt") {
      var a = ['noun', 'adj', 'verb']
      $scope.wordlist = {}
      $http.get("/api/word/noun").success(function (r) {
        $scope.wordlist['noun'] = r
      })
      $http.get("/api/word/adj").success(function (re) {
        $scope.wordlist['adj'] = re
      })
      $http.get("/api/word/verb").success(function (res) {
        $scope.wordlist['verb'] = res
      })
    } else if (['adj','adv','noun','verb'].indexOf($scope.wordtype != -1)) {
      $http.get("/api/word/"+$routeParams.entityid).success(function (response) {
        $scope.w = response
      })
    }
  }
  initPage();

}]);
