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
  function ($rootScope, $scope, $location, toastr, AuthenticationService) {

    $scope.username = undefined;
    $scope.password = undefined;
    $scope.authType = 'not-refreshed';

    $scope.refreshAuthType = function () {
      AuthenticationService.getAuthenticator(
        function (auth) {
          console.log('Authenticator ' + auth.data);
          $scope.authType = auth.data;
        },
        function (error) {
          console.log('Couldn\'t reach autheticator.');
        }
      )
    };
    $scope.refreshAuthType();

    $scope.compareAuthType = function (auth) {
      return auth === $scope.authType;
    };

    $scope.doLogin = function () {
      if ($scope.authType === 'commonauth') {

      } else if ($scope.authType === 'ldapauth') {
        AuthenticationService.ldapSessionLogin($scope.username, $scope.password,
          function () {
            $location.path('/tasks');
          },
          function (error) { //Erro call back
            console.log('Login error: ' + JSON.stringify(error));
          }
        );
      }
    };

    $scope.getUsername = function () {
      return AuthenticationService.getUsername();
    }

    $scope.doLogout = function () {
      AuthenticationService.doLogout();
      $scope.username = undefined;
      $location.path('/');
    }
  }
);
