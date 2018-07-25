'use strict';

angular.module('ArrebolServices').service(
	'Session',
	function () {
		var session = {};
		session.user = {
			name: undefined,
			login: undefined,
			pass: undefined,
			token: undefined
		};

		if (window.sessionStorage.user) {
			if (JSON.parse(window.sessionStorage.user).login !== undefined) {
				session.user = JSON.parse(window.sessionStorage.user);
			}
		} else {
			window.sessionStorage.user = JSON.stringify(session.user);
		}

		if (JSON.parse(window.sessionStorage.user).login === undefined) {
			window.sessionStorage.user = JSON.stringify(session.user);
		} else {
			session.user = JSON.parse(window.sessionStorage.user);
		}

		session.createTokenSession = function (userName, userToken) {
			session.user = {
				name: userName,
				token: userToken
			};
			window.sessionStorage.user = JSON.stringify(session.user);
		};

		// session.createLdapSession = function (userName, login, pass) {
		// 	console.log('Creating Ldap Session');
		// 	session.user = {
		// 		authType: 'ldapauth',
		// 		name: userName,
		// 		login: login,
		// 		pass: pass
		// 	};
		// 	window.sessionStorage.user = JSON.stringify(session.user);
		// };

		session.destroy = function () {
			session.user = {
				name: undefined,
				login: undefined,
				pass: undefined,
				token: undefined
			};
			window.sessionStorage.user = JSON.stringify(session.user);
		};

		session.getUser = function () {
			return JSON.parse(window.sessionStorage.user);
		};

		return session;
	}
);

angular.module('ArrebolServices').service(
	'NonceService',
	function ($http, appConfig) {
		var nonceServ = {};
		var resourceNonceUrl = appConfig.host + appConfig.nonceEndpoint;
		// var resourceNonceUrl = 'http://127.0.0.1:8080/nonce'; //TODO

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
	function ($http, appConfig, NonceService, Session, ExternalOAuthService) {
		var authServ = {};

		var resourceAuthUrl = appConfig.host + appConfig.userEndpoint;
		var resourceAuthenticatorUrl = appConfig.host + appConfig.authenticatorEndpoint;

		authServ.checkUser = function () {
			var user = Session.getUser();
			if (user.token === undefined) {
				return false;
			} else {
				return true;
			}
		};

		authServ.getUsername = function () {
			var user = Session.getUser();
			return user.name;
		};

		// authServ.getAuthenticator = function (callbackSuccess, callbackError) {
		// 	$http.get(resourceAuthenticatorUrl).then(callbackSuccess, callbackError);
		// };

		// authServ.ldapSessionLogin = function (userLogin, password, callbackSuccess, callbackError) {
		// 	var userName = userLogin; //For now user name is the login.
		// 	Session.createLdapSession(userName, userLogin, password);
		//
		// 	var loginSuccessHandler = function (response) {
		// 		callbackSuccess(response);
		// 	};
		// 	var loginErrorHandler = function (error) {
		// 		Session.destroy();
		// 		callbackError(error);
		// 	};
		//
		// 	var nonceCallback = function (nonce) {
		// 		var cred = {
		// 			username: userLogin,
		// 			password: password,
		// 			nonce: nonce
		// 		};
		// 		var data = {
		// 			'X-auth-credentials': angular.toJson(cred)
		// 		};
		// 		$http.post(
		// 			resourceAuthUrl,
		// 			$.param(data)
		// 		).then(loginSuccessHandler, loginErrorHandler);
		// 	};
		// 	NonceService.getNonce(nonceCallback, loginErrorHandler);
		// };

		authServ.doLogout = function () {
			Session.destroy();
		};

		authServ.signInWithOAuth = function (userName, callbackSuccess, callbackError) {
			ExternalOAuthService.getUserExternalOAuthToken(userName, callbackSuccess, callbackError);
		};

		return authServ;
	}
);

angular.module('ArrebolServices').service(
	'TasksService',
	function ($http, appConfig, NonceService, Session) {
		var tasksService = {};

		var externalOAuthTokenUrl = appConfig.iguassuServerHost + appConfig.oAuthEndpoint;

		tasksService.getTasksList = function (callbackSuccess, callbackError) {
			var nonceCallback = function (nonce) {
				var successCallback = function (response) {
					callbackSuccess(response.data);
				};

				var user = Session.getUser();
				var creds = {
					username: user.name,
					password: user.pass,
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
					password: user.pass,
					nonce: nonce
				}
				$http.get(
					resourceJobUrl + '/' + jobId,
					{headers: {'X-auth-credentials': JSON.stringify(creds)}}
				).then(
					successCallback,
					callbackError
				);
			}
			NonceService.getNonce(nonceCallback, callbackError);
		};

		tasksService.postJob = function (jdffile, callbackSuccess, callbackError) {
			var nonceCallback = function (nonce) {
				var user = Session.getUser();
				var creds = {
					username: user.name,
					password: user.pass,
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
					password: user.pass,
					nonce: nonce
				}

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
			}
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

		// externalOAuthService.getUserExternalOAuthToken = function (callbackSuccess, callbackError) {
		// 	var nonceCallback = function (nonce) {
		// 		var successCallback = function (response) {
		// 			callbackSuccess(response.data);
		// 		};
		//
		// 		var user = Session.getUser();
		// 		$http.get(
		// 			externalOAuthTokenUrl + '/' + user.name
		// 		).then(
		// 			successCallback,
		// 			callbackError
		// 		);
		// 	};
		// 	NonceService.getNonce(nonceCallback, callbackError);
		// };

		externalOAuthService.getUserExternalOAuthToken = function (userName, callbackSuccess, callbackError) {
			var successCallback = function (response) {
				callbackSuccess(response.data);
			};

			$http.get(
				externalOAuthTokenUrl + '/' + userName
			).then(
				successCallback,
				callbackError
			);
		};

		externalOAuthService.requestOwncloudAccessToken = function (authorizationCode, callbackSuccess, callbackError) {
			let url = appConfig.owncloudServerUrl + "index.php/apps/oauth2/api/v1/token?"
				+ "grant_type=authorization_code" + "&code=" + authorizationCode + "&redirect_uri=" + appConfig.owncloudClientRedirectUrl;
			let headers = {
				'Authorization': 'Basic ' + btoa(appConfig.owncloudClientId + ":" + appConfig.owncloudClientSecret)
			};

			$http.post(url, {}, {
				headers: headers
			}).then(
				callbackSuccess,
				callbackError
			)
		};

		externalOAuthService.postUserExternalOAuthToken = function (userName, accessToken, refreshToken, successCallback, failCallback) {
			// var user = Session.getUser();
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
			)
		};

		return externalOAuthService;
	}
);