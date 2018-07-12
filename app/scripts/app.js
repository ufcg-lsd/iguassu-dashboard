'use strict';

/**
 * @ngdoc overview
 * @name ArrebolApp
 * @description
 * # ArrebolApp
 *
 * Main module of the application.
 */
var app = angular.module(
  'ArrebolApp',
  [
    'ArrebolControllers',
    'ArrebolServices',
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'ui.bootstrap',
    'toastr'
  ]
);

angular.module('ArrebolControllers', ['ngResource']);
angular.module('ArrebolServices', ['ngResource']);

app.constant(
  'appConfig',
  {
    host: 'http://localhost:44444',
    userEndpoint: '/arrebol/user',
    jobEndpoint: '/job',
    authenticatorEndpoint: '/arrebol/authenticator',
    nonceEndpoint: '/arrebol/nonce'
  }
);

app.config(
  function ($routeProvider) {

    var checkUser = function ($location, AuthenticationService) {
      if (!AuthenticationService.checkUser()) {
        $location.path("/");
      }
    };

    var alreadyLoggedIn = function ($location, AuthenticationService) {
      if (AuthenticationService.checkUser()) {
        $location.path("/tasks");
      }
    }

    $routeProvider.when(
      '/',
      {
        templateUrl: 'views/login.html',
        resolve: {
          check: alreadyLoggedIn
        },
        controller: 'AuthCtrl'
      }
    ).when(
      '/tasks',
      {
        templateUrl: 'views/main.html',
        resolve: {
          check: checkUser
        },
        controller: 'MainCtrl'
      }
      ).when(
      '/tasks/:job',
      {
        templateUrl: 'views/tasks.html',
        resolve: {
          check: checkUser
        },
        controller: 'TasksCtrl'
      }
      ).otherwise(
      {
        redirectTo: '/tasks'
      }
      );
  }
);
