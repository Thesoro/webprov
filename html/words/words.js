'use strict';

angular.module('myApp.words', ['ngRoute'])

// .config(['$routeProvider', function($routeProvider) {
//   $routeProvider.when('/words', {
//     templateUrl: 'words/words.html',
//     controller: 'wordsCtrl'
//   });
// }])

.controller('wordsCtrl', function($scope, $http, $sce,$log) {
  $scope.sel = {sel:'zzzzzz'}
  $scope.projects = [
    {
        "youtubeUrl": "https://www.youtube.com/embed/QFvNhsWMU0c?autoplay=false",
        "name": "Nasa And We Know It",
        "summary": "A music video inspired by the Mars Curiosity Rover landing and LMFAO."
    }
,
    {
        "youtubeUrl": "https://www.youtube.com/embed/veXJWD0L1P4?autoplay=false",
        "name": "The Day The Lolcats Died",
        "summary": "A musical parody of Don McLean in protest of the SOPA/PIPA Bill."
    }
,
    {
        "youtubeUrl": "https://www.youtube.com/embed/hxPlHW0J2sU?autoplay=false",
        "name": "March Madness Explained in Star Wars",
        "summary": "Self-explanatory"
    }
,
    {
        "youtubeUrl": "https://www.youtube.com/embed/K4uEwaQQ4PM?autoplay=false",
        "name": "Job Hunters",
        "summary": "An action-comedy dystopian web series. Tiny marshmallows feature heavily. Produced in two seasons in 2012 and 2014."
    }
]


//Tells the $sce module that the URLs we're passing are OK and not part of an XSS attack
    var x;
    for (x in $scope.projects) {
      var y = $scope.projects[x].youtubeUrl;
      $scope.projects[x].youtubeUrl = $sce.trustAsResourceUrl(y);
    }
});
