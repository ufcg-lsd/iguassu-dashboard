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
    
    $scope.tasks = [];
    $scope.search = undefined;
    $scope.job = undefined;

    var updateTasks = function (returnedTaskList) {
        function updateTaskStatus(element, index, array) { 
          if ($scope.tasks[index].state !== undefined) {
            $scope.tasks[index].state = element.state;
          }            
        }
        returnedTaskList.forEach(updateTaskStatus);
    };

    $scope.getJobById = function(id) {
      var successCallback = function(job) {
        console.log(job);
        if (!$scope.job) {
          $scope.job = job;
        }
      };
      var errorCallback = function(error) {
        console.log(error);
      };
      JobsService.getJobById(id, successCallback, errorCallback);
    };

    $scope.getTasksByJobId = function(id) {
      var successCallback = function(tasks) {
        console.log(tasks);
        if ($scope.tasks.length === 0) {
          $scope.tasks = tasks;
        } else {
          updateTasks(tasks);
        }
      };
      var errorCallback = function(error) {
        console.log(error);
      };
      JobsService.getJobTasks(id, successCallback, errorCallback);
    };

    var showsTasks = function () {
        $scope.getTasksByJobId($routeParams.job);
        $scope.getJobById($routeParams.job);

        const INTERVAL_5_SECONDS = 5000;
        const refreshIntervalId = setInterval(() =>
            $scope.getTasksByJobId($routeParams.job),
            INTERVAL_5_SECONDS
        );
        
        UtilService.addIntervalId(refreshIntervalId);
    };

    showsTasks();
  }
);
