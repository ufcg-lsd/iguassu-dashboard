'use strict';

/**
 * @ngdoc function
 * @name IguassuApp.controller:JobsCtrl
 * @description
 * # JobsCtrl
 * Controller of the IguassuApp
 */
angular.module('IguassuControllers').controller(
	'JobsCtrl',
	function ($scope, $uibModal,toastr, TasksService) {

		$scope.jobs = [];
		$scope.search = [];		

		$scope.updateTaskList = function () {
			var successCallback = function (data) {
				$scope.jobs = data;
			};
			var failCallback = function (error) {
				console.log(error);
			};
			TasksService.getTasksList(successCallback, failCallback);
		};		

		$scope.updateTaskList();

		$scope.getStatusString = function (job) {			
			let tasksCompleted = 0;
			const COMPLETED = "COMPLETED";

			job.tasks.forEach(function(task){
				if (task.state === COMPLETED) {
					tasksCompleted++;
				};
			});

			let currentState = job.state;

			if (currentState === "CREATED") { currentState = "RUNNING"; }
			
			return (tasksCompleted !== 0 && tasksCompleted === job.tasks.length ) 
				? COMPLETED : currentState;
		};

		$scope.stopJob = function (job) {
			if (window.confirm('Do you want to stop the job ' + job.id + ' ' + job.name + ' ?')) {
				TasksService.deleteJob(
					job.id,
					function (data) {
						if (data === job.id) {
							toastr.success('The job ID ' + job.id + ' was stopped.', 'Job stopped');
						}
						$scope.updateTaskList();
					},
					function (error) {
						console.log(error);
						toastr.error('Error code: ' + error.code + ', Description: ' + error.data, 'Error while trying to stop job ID: ' + job.id + '.');
					}
				);
			}
		};

		$scope.openSubmissionModal = function () {

			var modalInstance = $uibModal.open(
				{
					animation: true,
					ariaLabelledBy: 'modal-title',
					ariaDescribedBy: 'modal-body',
					templateUrl: 'myModalContent.html',
					controller: 'SubmissionModalCtrl'
				}
			);
			modalInstance.result.then(
				function (jobId) {
					if (jobId) {
						toastr.success('Job ' + jobId + ' submitted.');
					}
					$scope.updateTaskList();
				},
				function (error) {
					toastr.error(error);
					$scope.updateTaskList();
				}
			);
		};
	});
