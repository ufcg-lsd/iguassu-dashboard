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
  function ($scope, $routeParams, JobsService, UtilService) {
    
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

    $scope.getJobById = function(id) {
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
      JobsService.getJobById(id, successCallback, errorCallback);
    };

    var showsTasks = function () {
        $scope.getJobById($routeParams.job);

        const INTERVAL_5_SECONDS = 5000;
        const refreshIntervalId = setInterval(() =>
            $scope.getJobById($routeParams.job),
            INTERVAL_5_SECONDS
        );
        UtilService.addIntervalId(refreshIntervalId);
    };

    showsTasks();
  }
);
