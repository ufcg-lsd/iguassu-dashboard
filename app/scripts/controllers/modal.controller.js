'use strict';

/**
 * @ngdoc function
 * @name ArrebolApp.controller:SubmissionModalCtrl
 * @description
 * # SubmissionModalCtrl
 * Controller of the ArrebolApp
 */
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
		};
	}
);