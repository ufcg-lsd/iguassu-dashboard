'use strict';

/**
 * @ngdoc function
 * @name ArrebolApp.controller:AuthCtrl
 * @description
 * # AuthCtrl
 * Controller of the ArrebolApp
 */
angular.module('ArrebolControllers').controller(
  'AuthCtrl',
  function ($rootScope, $scope, $location, $window, toastr, Session, AuthenticationService, ExternalOAuthService, appConfig) {

    $scope.owncloudUsername = undefined;
    $scope.password = undefined;
    $scope.authType = 'not-refreshed';
	  $scope.userRecentlyGotOAuthToken = false;

	  var checkIfUrlHasAuthorizationCode = function () {
		  let currentUrl = $location.$$absUrl;
		  let re = /code=[a-zA-Z0-9.]+(?=#!)/;
		  let regexAns = re.exec(currentUrl);
		  if (regexAns !== null && typeof regexAns[0] === "string" && !$scope.userRecentlyGotOAuthToken) {
			  let splittedRegexAns = regexAns[0].split("=");
			  let authorizationCode = splittedRegexAns[1];
			  return authorizationCode;
		  }
	  };

	  var doLoginSuccessCallBack = function (res) {
		  $scope.userRecentlyGotOAuthToken = true;
		  let userToken = res.token ? res.token : res.data ? res.data.accessToken : null; // key is token when response comes
		                                                          // from Iguassu but is accesToken when comes from OwnCloud
		  Session.createTokenSession($scope.username, userToken);
		  $location.path('/tasks');
	  };

    $scope.doLogin = function () {

      let failCallBack = function (error) { //Erro call back
        if (error.status === 400) {
          let req = appConfig.owncloudServerUrl + "index.php/apps/oauth2/authorize" + "?response_type=code&" +
            "client_id=" + appConfig.owncloudClientId + "&redirect_uri=" + appConfig.owncloudClientRedirectUrl +
            "&user=" + $scope.owncloudUsername;
          $window.location.href = req;
        } else {
          console.log('Login error: ' + JSON.stringify(error));
        }
      };

	    AuthenticationService.signInWithOAuth($scope.username, doLoginSuccessCallBack, failCallBack);
    };

    $scope.getUsername = function () {
      return AuthenticationService.getUsername();
    };

    $scope.doLogout = function () {
      AuthenticationService.doLogout();
      $scope.owncloudUsername = undefined;
      $location.path('/');
    };

	  let authorizationCode = checkIfUrlHasAuthorizationCode();
	  if (authorizationCode !== undefined) {
		  var failCallback = function (error) {
			  console.log(error);
		  };
		  var successCallback = function (res) {
			  let accessToken = res.data.access_token;
			  let refreshToken = res.data.refresh_token;
			  $scope.owncloudUsername = res.data.user_id;

			  if ($scope.owncloudUsername !== undefined) {
			  	// TODO: do not post if user just got authcode and posted to iguassu
				  ExternalOAuthService.postUserExternalOAuthToken($scope.owncloudUsername, accessToken, refreshToken, doLoginSuccessCallBack, failCallback);
			  }
		  };
		  ExternalOAuthService.requestOwncloudAccessToken(authorizationCode, successCallback, failCallback);
	  }
   
  }
);
