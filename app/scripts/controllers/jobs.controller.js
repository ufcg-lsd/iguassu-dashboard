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
	function ($scope, $uibModal,toastr, JobsService, Session, UtilService) {

		$scope.jobs = [];
		$scope.search = [];				

		$scope.updateJobList = function () {
			var successCallback = function (data) {
				$scope.jobs = data;	
				console.log(data);
			};
			var failCallback = function (error) {
				console.log(error);
			};			
			JobsService.getAllJobs(successCallback, failCallback);
		};	

		$scope.getStatusString = function (job) {		
			return job.state ? job.state : "SUBMITTING";
		}

		$scope.jobIsFinished = function (job) {
			return job.state === "FINISHED";
		}

		$scope.removeJob = function (job) {
			if (window.confirm('Do you want to remove the job ' + job.id + ' ' + job.name + ' ?')) {
				JobsService.deleteJob(
					job.id,
					function (data) {
						console.log("data returned by delete :" + data)
						if (data === job.id) {
							toastr.success('The job ID ' + job.id + ' was removed.', 'Job removed');
						}
						$scope.updateJobList();
					},
					function (error) {
						console.log(error);
						toastr.error('Error code: ' + error.code + ', Description: ' + error.data, 'Error while trying to remove job: ' + job.name + '.');
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
			const refreshIntervalId = setInterval(() =>
				$scope.updateJobList(),
				INTERVAL_1_SECOND
			);
			UtilService.addIntervalId(refreshIntervalId);
		};			

		if (Session.userIsLogged()) {
			updateJobListPeriodically();
		} 		
	}
);
