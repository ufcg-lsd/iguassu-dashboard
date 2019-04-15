"use strict";

/**
 * @ngdoc function
 * @name IguassuApp.controller:AuthCtrl
 * @description
 * # AuthCtrl
 * Controller of the IguassuApp
 */
angular
  .module("IguassuControllers")
  .controller("AuthCtrl", function(
    $rootScope,
    $scope,
    $location,
    $window,
    $route,    
    Session,
    AuthenticationService,
    ExternalOAuthService,
    appConfig
  ) {
      $scope.owncloudUsername = undefined;
      $scope.authorizationCode = undefined;
      $scope.accessToken = undefined;
      $scope.refreshToken = undefined;
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

          $scope.authorizationCode = authorizationCode;         
        }
      }

      function doLoginSuccessCallBack() {
        $scope.userRecentlyGotOAuthToken = true;
        console.log("The user has been posted with success in the Iguassu.");      
      }

      $scope.doOwncloudOAuth = function() {
        var failCallBack = function(error) {          
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
          doLoginSuccessCallBack,
          failCallBack
        );
      };    

      $scope.getUsername = function() {
        return AuthenticationService.getUser().name;
      };

      $scope.doLogout = function() {
        AuthenticationService.doLogout();
        $scope.owncloudUsername = undefined;
        $location.path("/");
        $route.reload();
      };
      
      checkIfUrlHasAuthorizationCode();      

      if ($scope.authorizationCode !== undefined) {
        var failCallback = function(error) {
          console.log(error);
        };
        var successCallback = function(res) {          
          console.log("Request of token was sucessfull.");
          $scope.accessToken = res.data.access_token;          
          $scope.refreshToken = res.data.refresh_token;
          $scope.owncloudUsername = res.data.user_id;        

          Session.createTokenSession($scope.owncloudUsername, $scope.accessToken, $scope.refreshToken);

          if ($scope.accessToken) {
            ExternalOAuthService.postUserExternalOAuthToken(
              $scope.owncloudUsername,
              $scope.accessToken,
              $scope.refreshToken,
              doLoginSuccessCallBack,
              failCallback
            );
          } 
          $route.reload();
        };

        var user = AuthenticationService.getUser();                
        if (Object.getOwnPropertyNames(user).length == 0) {
          ExternalOAuthService.requestOwncloudAccessToken(
            $scope.authorizationCode,
            successCallback,
            failCallback
          );
        }                        
      }       
    }
  );
