'use strict';

/**
 * @ngdoc function
 * @name ArrebolApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the ArrebolApp
 */
angular.module('ArrebolControllers').controller(
	'MainCtrl',
	function ($rootScope, $scope, $uibModal, $location, toastr, TasksService, ExternalOAuthService, $window, $route) {

		$scope.jobs = [];
		$scope.search = [];

		var checkIfUserHasOAuthToken = function (successCallBack, failCallback) {
			ExternalOAuthService.getUserExternalOAuthToken(successCallBack, failCallback);
		};

		var checkIfUrlHasAuthorizationCode = function () {
			let currentUrl = $location.$$absUrl;
			let re = /code=[a-zA-Z0-9.]+(?=#!)/;
			let regexAns = re.exec(currentUrl);
			if (regexAns !== null && typeof regexAns[0] === "string") {
				let splittedRegexAns = regexAns[0].split("=");
				let authorizationCode = splittedRegexAns[1];
				return authorizationCode;
			}
		};

		var cleanExternalAuthCodeFromUrl = function () {
			console.log($location);
			$location.url($location.path()); //TODO
		};

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

		$scope.openSubmissionModal = async function () {
			var successCallBack = function (data) {
				let token = data.token;
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
							toastr.success('Job ' + jobId + ' submitted.')
						}
						$scope.updateTaskList();
					},
					function (error) {
						toastr.error(error);
						$scope.updateTaskList();
					}
				)
			};

			var failCallback = function (error) {
				if (error.status == 400) {
					// TODO
					let req = "http://169.254.0.1/index.php/apps/oauth2/authorize?response_type=code&client_id=TkDJIPaAoovAseBEO0eh9ocHlvUcc7fxxHcSs9oSWvjnpTDT2QUmY71xdcw3boYy&redirect_uri=http://localhost:8000";
					$window.location.href = req;
				} else {
					console.log(error);
				}
			};

			checkIfUserHasOAuthToken(successCallBack, failCallback);
		};

		let authorizationCode = checkIfUrlHasAuthorizationCode();
		if (authorizationCode !== undefined) {
			var failCallback = function (error) {
				console.log(error);
			};
			var successCallback = function (res) {
				let accessToken = res.data.access_token;
				let refreshToken = res.data.refresh_token;
				ExternalOAuthService.postUserExternalOAuthToken(accessToken, refreshToken, cleanExternalAuthCodeFromUrl, failCallback);
			};
			ExternalOAuthService.requestOwncloudAccessToken(authorizationCode, successCallback, failCallback);
		}
	}
);

angular.module('ArrebolControllers').controller(
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
		}
	}
);
