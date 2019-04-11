"use strict";

/**
 * @ngdoc function
 * @name ArrebolApp.controller:AuthCtrl
 * @description
 * # AuthCtrl
 * Controller of the ArrebolApp
 */
angular
  .module("ArrebolControllers")
  .controller("AuthCtrl", function(
    $rootScope,
    $scope,
    $location,
    $window,
    toastr,
    Session,
    AuthenticationService,
    ExternalOAuthService,
    appConfig
  ) {
    $scope.owncloudUsername = undefined;
    $scope.password = undefined;
    $scope.authType = "not-refreshed";
    $scope.userRecentlyGotOAuthToken = false;

    function checkIfUrlHasAuthorizationCode() {
      var currentUrl = $location.$$absUrl;
      var re = /code=[a-zA-Z0-9.]+(?=#!)/;
      var regexAns = re.exec(currentUrl);
      if (
        regexAns !== null &&
        typeof regexAns[0] === "string" &&
        !$scope.userRecentlyGotOAuthToken
      ) {
        var splittedRegexAns = regexAns[0].split("=");
        var authorizationCode = splittedRegexAns[1];
        console.log(authorizationCode);
        return authorizationCode;
      }
    }

    function doLoginSuccessCallBack(res) {
      $scope.userRecentlyGotOAuthToken = true;
      console.log(res);
      var userToken = res.token
        ? res.token
        : res.data
          ? res.data.accessToken
          : null; // key is token when response comes
      // from Iguassu but is accesToken when comes from OwnCloud
      Session.createTokenSession($scope.owncloudUsername, userToken);
      $location.url("/tasks");
    }

    $scope.doOwncloudOAuth = function() {
      var failCallBack = function(error) {
        //Erro call back
        if (error.status === 400) {
          var req =
            appConfig.owncloudServerUrl +
            "/index.php/apps/oauth2/authorize" +
            "?response_type=code&" +
            "client_id=" +
            appConfig.owncloudClientId +
            "&redirect_uri=" +
            appConfig.owncloudClientRedirectUrl;
          $window.location.href = req;
        } else {
          console.log("Login error: " + JSON.stringify(error));
        }
      };

      AuthenticationService.signInWithOAuth(
        $scope.owncloudUsername,
        doLoginSuccessCallBack,
        failCallBack
      );
    };

    $scope.doLoginWithCafe = function() {
      if (Session.getUser().eduUsername) {
        $location.path("/tasks");
      }
      $window.location.href = appConfig.nafAuthUrl;
    };

    $scope.getUsername = function() {
      return AuthenticationService.getUser().eduUsername;
    };

    $scope.doLogout = function() {
      AuthenticationService.doLogout();
      $scope.owncloudUsername = undefined;
      $location.path("/");
    };

    $scope.goToAuthWithOwncloud = function() {
      $location.path("/owncloud");
    };

    var authorizationCode = checkIfUrlHasAuthorizationCode();
    if (authorizationCode !== undefined) {
      var failCallback = function(error) {
        console.log(error);
      };
      var successCallback = function(res) {
        console.log("Request of token was sucessfull");
        var accessToken = res.data.access_token;
        var refreshToken = res.data.refresh_token;
        $scope.owncloudUsername = res.data.user_id;

        if ($scope.owncloudUsername !== undefined) {
          // TODO: do not post if user just got authcode and posted to iguassu
          ExternalOAuthService.postUserExternalOAuthToken(
            $scope.owncloudUsername,
            accessToken,
            refreshToken,
            doLoginSuccessCallBack,
            failCallback
          );
        }
      };
      ExternalOAuthService.requestOwncloudAccessToken(
        authorizationCode,
        successCallback,
        failCallback
      );
    }
  });
