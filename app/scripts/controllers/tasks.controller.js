'use strict';

/**
 * @ngdoc function
 * @name IguassuApp.controller:TasksCtrl
 * @description
 * # TasksCtrl
 * Controller of the IguassuApp
 */
angular.module('IguassuControllers').controller(
  'TasksCtrl',
  function ($scope, $routeParams, JobsService) {
    
    $scope.job = undefined;
    $scope.search = undefined;

    var updateTasks = function (returnedTaskList) {
        function updateTaskStatus(element, index, array) { 
            if ($scope.job.tasks[index].state !== undefined) {
              $scope.job.tasks[index].state = element.state;
            }            
        }
        returnedTaskList.forEach(updateTaskStatus);
    };

    $scope.getTask = function(id) {
      var successCallback = function(job) {
        if (!$scope.job) {
          $scope.job = job;
        } else {
            updateTasks(job.tasks);
        }
      };
      var errorCallback = function(error) {
        console.log(error);
      };
      JobsService.getTask(id, successCallback, errorCallback);
    };

    var showsTasks = function () {
        $scope.getTask($routeParams.job);

        const INTERVAL_5_SECONDS = 10000;
        setInterval(() =>
            $scope.getTask($routeParams.job),
            INTERVAL_5_SECONDS
        );
    };

    showsTasks();
  }
);
