'use strict';

/**
 * @ngdoc function
 * @name IguassuApp.controller:SubmissionModalCtrl
 * @description
 * # SubmissionModalCtrl
 * Controller of the IguassuApp
 */
angular.module('IguassuControllers').controller(
	'SubmissionModalCtrl',
	function ($scope, $uibModalInstance, JobsService) {
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
			JobsService.postJob($scope.jdffile, successCallback, errorCallback);
		};

		$scope.closeModal = function () {
			$scope.clearJDF();
			$uibModalInstance.close(undefined);
		};
	}
);