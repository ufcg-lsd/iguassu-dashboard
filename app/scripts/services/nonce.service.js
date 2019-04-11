'use strict';

angular.module('ArrebolServices').service(
	'NonceService',
	function ($http, appConfig) {
		var nonceServ = {};
		var resourceNonceUrl = appConfig.iguassuServerHost + appConfig.nonceEndpoint;

		nonceServ.getNonce = function (callbackSuccess, callbackError) {
			var successCallback = function (response) {
				callbackSuccess(response.data);
			};
			$http
				.get(resourceNonceUrl)
				.then(successCallback, callbackError);
		};

		return nonceServ;
	}
);
