'use strict';

angular.module('IguassuServices').service(
	'TasksService',
	function (appConfig, NonceService, Session, $http) {
		var tasksService = {};

		var resourceJobUrl = appConfig.iguassuServerHost + appConfig.jobEndpoint;

		tasksService.getTasksList = function (callbackSuccess, callbackError) {
			var nonceCallback = function (nonce) {
				var successCallback = function (response) {
					console.log(response);
					console.log(response.data);					
					callbackSuccess(response.data);
				};

				var user = Session.getUser();
				var creds = {					
					username: user.name,
					token: user.token,
					nonce: nonce
				};
				$http.get(
					resourceJobUrl,
					{headers: {'X-auth-credentials': JSON.stringify(creds)}}
				)
				.then(successCallback, callbackError)
			};
			NonceService.getNonce(nonceCallback, callbackError);
		};

		tasksService.getTask = function (jobId, callbackSuccess, callbackError) {
			var nonceCallback = function (nonce) {
				var successCallback = function (response) {
					callbackSuccess(response.data);
				};

				var user = Session.getUser();
				var creds = {
					username: user.name,
					token: user.token,
					nonce: nonce
				};
				$http.get(
					resourceJobUrl + '/' + jobId,
					{ headers: {'X-auth-credentials': JSON.stringify(creds)} }
				)
					.then(successCallback,callbackError);					
			};
			if (jobId !== undefined) {
				NonceService.getNonce(nonceCallback, callbackError);
			}
		};

		tasksService.postJob = function (jdffile, callbackSuccess, callbackError) {
			var nonceCallback = function (nonce) {
				var user = Session.getUser();
				var creds = {
					username: user.name,
					token: user.token,
					nonce: nonce
				};

				var form = new FormData();
				form.append('jdffilepath', jdffile);
				form.append('X-auth-credentials', angular.toJson(creds));

				$http.post(
					resourceJobUrl,
					form,
					{
						transformRequest: angular.identity,
						transformResponse: function myTransformFn(data, headersGetter, status) {
							return JSON.stringify(data);
						},
						headers: {
							'X-auth-credentials': JSON.stringify(creds),
							'Accept': 'application/json',
							'Content-Type': undefined
						}
					}
				)
				.then(callbackSuccess, callbackError);				
			};
			NonceService.getNonce(nonceCallback, callbackError);
		};

		tasksService.deleteJob = function (jobId, callbackSuccess, callbackError) {
			var nonceCallback = function (nonce) {
				var user = Session.getUser();
				var creds = {
					username: user.name,
					token: user.token,
					nonce: nonce
				};

				$http.delete(
					resourceJobUrl + '/' + jobId,
					{
						headers: {
							'X-auth-credentials': JSON.stringify(creds)
						}
					}
				)
				.then(
					function (response) {
						callbackSuccess(response.data);
					},
					callbackError					
				);
			};
			NonceService.getNonce(nonceCallback, callbackError);
		};

		return tasksService;
	}
);