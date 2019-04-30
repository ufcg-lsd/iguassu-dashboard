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
	function ($scope, $uibModal,toastr, JobsService) {

		$scope.jobs = [];
		$scope.search = [];		

		$scope.updateJobList = function () {
			var successCallback = function (data) {
				$scope.jobs = data;				
			};
			var failCallback = function (error) {
				console.log(error);
			};
			JobsService.getAllJobs(successCallback, failCallback);
		};	

		$scope.getStatusString = function (job) {		
			return job.state ? job.state : "SUBMITTING";
		}

		$scope.stopJob = function (job) {
			if (window.confirm('Do you want to stop the job ' + job.id + ' ' + job.name + ' ?')) {
				JobsService.deleteJob(
					job.id,
					function (data) {
						if (data === job.id) {
							toastr.success('The job ID ' + job.id + ' was stopped.', 'Job stopped');
						}
						$scope.updateJobList();
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
					$scope.updateJobList();
				},
				function (error) {
					toastr.error(error);
					$scope.updateJobList();
				}
			);
		};

		var updateJobListPeriodically = function () {
			const INTERVAL_1_SECOND = 1000;
			setInterval(() =>
				$scope.updateJobList(),
				INTERVAL_1_SECOND
			);
		};	
		
		updateJobListPeriodically();
	}
);
