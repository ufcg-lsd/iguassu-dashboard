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

      var updateTasks = function (returnedTaskList) {
          function updateTaskStatus(element, index, array) {
              $scope.job.tasks[index].state = element.state;
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
      TasksService.getTask(id, successCallback, errorCallback);
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
