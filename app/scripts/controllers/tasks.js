'use strict';

/**
 * @ngdoc function
 * @name ArrebolApp.controller:TaskCtrl
 * @description
 * # TaskCtrl
 * Controller of the ArrebolApp
 */
angular.module('ArrebolControllers').controller(
  'TasksCtrl',
  function ($scope, $rootScope, $routeParams, TasksService) {
    
    $scope.job = undefined;
    $scope.search = undefined;

    $scope.getTask = function(id) {
      var successCallback = function(job) {
        $scope.job = job;
      };
      var errorCallback = function(error) {
        console.log(error);
      }
      TasksService.getTask(id, successCallback, errorCallback);
    };
    $scope.getTask($routeParams.job);
  }
);
