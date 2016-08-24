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
  $scope.w = {}
  $scope.teamname = ''
  $scope.allit = {}
  $scope.allit.allit = false

  $scope.randomWord = function() {
    $scope.getWord();
  }

  $scope.getWord = function() {
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
    } else if ($scope.wordtype == "teamname") {
      $scope.teamname = 'loading...'
      $scope.getname = "/api/word/teamname/"
      $log.info($scope.allit.allit)
      if ($scope.allit.allit) {
        $scope.getname = $scope.getname + "y"
      } else {
        $scope.getname = $scope.getname + "n"
      }
      $http.get($scope.getname).success(function (re) {
        $scope.teamname = re['word']
      })

    } else if (['adj','adv','noun','verb','title','emotion'].indexOf($scope.wordtype != -1)) {
      $http.get("/api/word/"+$routeParams.entityid).success(function (response) {
        $scope.w = response
      })
    }
  }
  var initPage = function() {
    $scope.wordtype = $routeParams.entityid
    $scope.getWord()
  }
  initPage();

}]);
