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
    host: 'http://10.11.4.10:44444',

    jobEndpoint: '/job',
    nonceEndpoint: '/nonce',
    oAuthEndpoint: '/oauthtoken/',

	  iguassuServerHost: 'http://127.0.0.1:8080',

		owncloudServerUrl: 'http://169.254.0.1/',
    owncloudClientId: 'TkDJIPaAoovAseBEO0eh9ocHlvUcc7fxxHcSs9oSWvjnpTDT2QUmY71xdcw3boYy',
		owncloudClientSecret: 'hoX2FDChXUWAQ1S1vIQ7SsicRvcxuZJ71yUIjtcCyLFch32Vf8QYdFAZysbmWM2v',
		owncloudClientRedirectUrl: 'http://localhost:8000'
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
