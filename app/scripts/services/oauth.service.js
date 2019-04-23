'use strict';

angular.module('IguassuServices').service(
	'ExternalOAuthService',
	function (appConfig, Session) {
		var externalOAuthService = {};

		var externalOAuthTokenUrl = appConfig.iguassuServerHost + appConfig.oAuthEndpoint;

		externalOAuthService.getUserExternalOAuthToken = function (callbackSuccess, callbackError) {
			var user = Session.getUser();
			console.log(user);
			if (user.token) {
                callbackSuccess(user.token);
			} else {
				var error = {status: 400};
				callbackError(error);
			}
		};

		externalOAuthService.requestOwncloudAccessToken = function (authorizationCode, callbackSuccess, callbackError) {
			let url = appConfig.owncloudServerUrl + "/index.php/apps/oauth2/api/v1/token?" +
				"grant_type=authorization_code" + "&code=" + authorizationCode + "&redirect_uri=" + appConfig.owncloudClientRedirectUrl;
			let headers = {
				'Authorization': 'Basic ' + btoa(appConfig.owncloudClientId + ":" + appConfig.owncloudClientSecret)
			};

			axios.post(url, {}, { headers: headers })
			.then(callbackSuccess)
			.catch(callbackError);
		};

		externalOAuthService.postUserExternalOAuthToken = function (userName, accessToken, refreshToken, successCallback, failCallback) {
			let oneHourInSeconds = "3600";
			let data = {
				accessToken: accessToken,
				refreshToken: refreshToken,
				usernameOwner: userName,
				expirationDate: oneHourInSeconds
			};
			let headers = {}; 		

			axios.post(externalOAuthTokenUrl, data, { headers: headers })
			.then(successCallback)
			.catch(failCallback);
		};

		return externalOAuthService;
	}
);