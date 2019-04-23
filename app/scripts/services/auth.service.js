'use strict';

angular.module('IguassuServices').service(
	'AuthenticationService',
	function (Session, ExternalOAuthService) {
		var authServ = {};

		authServ.getUser = function () {
			return Session.getUser();			
		};

		authServ.doLogout = function () {
			Session.destroy();
		};

		authServ.signInWithOAuth = function (callbackSuccess, callbackError) {
			ExternalOAuthService.getUserExternalOAuthToken(callbackSuccess, callbackError);
		};

		authServ.signInWithCAFe = function (userName, callbackSuccess, callbackError) {
			ExternalOAuthService.getUserExternalOAuthToken(userName, callbackSuccess, callbackError);
		};

		return authServ;
	}
);
