'use strict';

angular.module('IguassuServices').service(
	'AuthenticationService',
	function ($http, $location, appConfig, NonceService, Session, ExternalOAuthService) {
		var authServ = {};

		authServ.checkCAFeUser = function () {
		  var user = Session.getUser();
		  if (user.eduUsername === undefined) {
			return true; // Set this to false when CAFe turns
		  } else {
			return true;
		  }
		};

		authServ.checkIfUrlHasCAFeEduUsername = function () {
		  let currentUrl = $location.$$absUrl;
		  let re = /eduPersonPrincipalName=[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}/;
		  let regexAns = re.exec(currentUrl);
		  if (regexAns !== null && typeof regexAns[0] === "string") {
			let splittedRegexAns = regexAns[0].split("=");
			let eduUserEmail = splittedRegexAns[1];
			let eduUserEmailSplitted = eduUserEmail.split("@");
			let eduUsername = eduUserEmailSplitted[0];
			Session.setEduUsername(eduUsername);
			return eduUsername;
		  }
		};

		authServ.getUser = function () {
			return Session.getUser();
			// return user.name;
		};

		authServ.doLogout = function () {
			Session.destroy();
		};

		authServ.signInWithOAuth = function (userName, callbackSuccess, callbackError) {
			ExternalOAuthService.getUserExternalOAuthToken(userName, callbackSuccess, callbackError);
		};

		authServ.signInWithCAFe = function (userName, callbackSuccess, callbackError) {
			ExternalOAuthService.getUserExternalOAuthToken(userName, callbackSuccess, callbackError);
		};

		return authServ;
	}
);
