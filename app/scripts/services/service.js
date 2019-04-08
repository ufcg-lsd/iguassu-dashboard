'use strict';

angular.module('ArrebolServices').service(
	'Session',
	function ($window) {
		var session = {};
		session.user = {
			name: undefined,
		  	token: undefined,
		  	eduUsername: undefined
		};

		session.USER_COOKIE_KEY = "iguassu-user-cookie-key";
		
		function localStoreUser(user) {
      		$window.localStorage.setItem(session.USER_COOKIE_KEY, JSON.stringify(user));
    	}
		
		function getLocalStoredUser() {
		  return JSON.parse($window.localStorage.getItem(session.USER_COOKIE_KEY));
		}
    
		if (getLocalStoredUser()) {			
			if (getLocalStoredUser().eduUsername !== undefined) {				
				session.user = getLocalStoredUser();
			}
		} else {			
		  localStoreUser(session.user);
    	}

		session.createTokenSession = function (userName, userToken) {			
			let oldSession = session.getUser();			
			session.user = {
				name: oldSession.name ? oldSession.name : userName,
				eduUsername: oldSession.eduUsername,
				token: oldSession.token ? oldSession.token : userToken
			};			
      		localStoreUser(session.user);
		};

		session.destroy = function () {
			session.user = {
				name: undefined,
				token: undefined,
        		eduUsername: undefined
			};
      		localStoreUser(session.user);
		};

		session.getUser = function () {
			return getLocalStoredUser();
		};

		session.setEduUsername = function (eduUsername) {
			session.user = {
				name: undefined,
        		eduUsername: eduUsername,
        		token: undefined
      		};
      		localStoreUser(session.user);
		};
		
		return session;
	}
);

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

angular.module('ArrebolServices').service(
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

angular.module('ArrebolServices').service(
	'TasksService',
	function ($http, appConfig, NonceService, Session) {
		var tasksService = {};

		var resourceJobUrl = appConfig.iguassuServerHost + appConfig.jobEndpoint;

		tasksService.getTasksList = function (callbackSuccess, callbackError) {
			var nonceCallback = function (nonce) {
				var successCallback = function (response) {
					callbackSuccess(response.data);
				};

				var user = Session.getUser();
				var creds = {					
					username: user.name, // Change this to eduUsername
					token: user.token,
					nonce: nonce
				};
				$http.get(
					resourceJobUrl,
					{headers: {'X-auth-credentials': JSON.stringify(creds)}}
				).then(
					successCallback,
					callbackError
				);
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
				).then(
					successCallback,
					callbackError
				);
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
				).then(
					callbackSuccess,
					callbackError
				);
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
				).then(
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

angular.module('ArrebolServices').service(
	'ExternalOAuthService',
	function ($http, appConfig, NonceService, Session) {
		var externalOAuthService = {};

		var externalOAuthTokenUrl = appConfig.iguassuServerHost + appConfig.oAuthEndpoint;

		externalOAuthService.getUserExternalOAuthToken = function (userName, callbackSuccess, callbackError) {
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

			$http.post(url, {}, {
				headers: headers
			}).then(
				callbackSuccess,
				callbackError				
			);
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

			$http.post(externalOAuthTokenUrl, data, {
				headers: headers
			}).then(
				successCallback,
				failCallback
			);
		};

		return externalOAuthService;
	}
);