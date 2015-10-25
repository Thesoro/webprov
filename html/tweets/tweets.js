'use strict';

angular.module('myApp.tweets', ['ngRoute'])

.controller('tweetsCtrl', ['$scope','$http','$location','$log',
  function($scope,$http,$location,$log) {

  $scope.getTweets = function() {
    if ($scope.username != $scope.activeuser) {
      $http.get("/api/tweets/" + $scope.username.replace('@','')).success(function (re) {
        $scope.tweets = re;
        $scope.alreadychosen = {};
        $scope.activeuser = $scope.username;
        $scope.error = false;

        if ($scope.tweets.length) {
          $scope.randomTweet();
        } else {
          $scope.error = true;
        }


      }).error(function (re) {
        $scope.error = true;
      });
    } else {
      $scope.randomTweet();
    }
  };

  $scope.randomTweet = function() {
    if (!$scope.error) {
      var num = Math.floor(Math.random() * 200);
      //make sure we get a tweet not already looked at
      while ($scope.alreadychosen[num] || !$scope.tweets[num]) {
        num = Math.floor(Math.random() * 200);
        $log.info('already');
      }
      $scope.viewtweet = $scope.tweets[num];
      var a = $scope.viewtweet.created_at;
      a = new Date(a);
      $scope.viewtweet.created_at = a;
      $scope.alreadychosen[num] = true;
      if (Object.keys($scope.alreadychosen).length >= $scope.tweets.length) {
        $scope.alreadychosen = {};
      }
      $scope.viewtweet.text = $scope.viewtweet.text.replace('&amp;', '&');
    }
  };

  var initPage = function() {
    $scope.alreadychosen = {};
    $scope.username = '';
  };
  initPage();
}]);
