'use strict';

angular.module('myApp.other', ['ngRoute'])


.controller('otherCtrl', ['$scope','$http','$location','$log','$routeParams'
  ,function($scope,$http,$location,$log,$routeParams) {


  var initPage = function() {
    $scope.view = $routeParams.entityid

  }
  initPage();
}]);
