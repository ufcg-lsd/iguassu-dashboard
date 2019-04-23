'use strict';

angular.module('IguassuServices').service(
	'NonceService',
	function (appConfig) {
		var nonceServ = {};
		var resourceNonceUrl = appConfig.iguassuServerHost + appConfig.nonceEndpoint;

		nonceServ.getNonce = function (callbackSuccess, callbackError) {
			var successCallback = function (response) {
				callbackSuccess(response.data);
			};
			axios.get(resourceNonceUrl)
				.then(successCallback)
				.catch(callbackError);
		};
		return nonceServ;
	}
);
