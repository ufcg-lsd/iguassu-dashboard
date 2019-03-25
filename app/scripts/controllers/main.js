'use strict';

/**
 * @ngdoc function
 * @name IguassuApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the IguassuApp
 */
angular.module('IguassuControllers').controller(
	'MainCtrl',
	function ($rootScope, $scope, $uibModal, $location, toastr, TasksService, ExternalOAuthService, $window) {

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
			if (job.completition === 100) {
				return 'COMPLETED';
			} else if (job.completition > 0) {
				return 'RUNNING';
			} else {
				return 'SUBMITTED';
			}
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

angular.module('IguassuControllers').controller(
	'SubmissionModalCtrl',
	function ($scope, $uibModalInstance, TasksService) {
		$scope.jdffile = undefined;

		$scope.fileChanged = function (element) {
			$scope.jdffile = element.files[0];
		};

		$scope.clearJDF = function () {
			$scope.jdffile = undefined;
		};

		$scope.submitJDF = function () {
			if ($scope.jdffile === undefined) {
				return;
			}
			var successCallback = function (response) {
				$scope.clearJDF();
				$uibModalInstance.close(response.data);
			};
			var errorCallback = function (error) {
				console.log(error);
				$scope.clearJDF();
				$uibModalInstance.dismiss(error.data);
			};
			TasksService.postJob($scope.jdffile, successCallback, errorCallback);
		};

		$scope.closeModal = function () {
			$scope.clearJDF();
			$uibModalInstance.close(undefined);
		};
	}
);
