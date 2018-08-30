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
    host: 'http://XX.XX.X.X:XXXX',

    jobEndpoint: '/job',
    nonceEndpoint: '/nonce',
    oAuthEndpoint: '/oauthtoken/',

	  iguassuServerHost: 'http://XXX.X.X.X:XXXX',

    owncloudServerUrl: 'http://XXX.X.X.X:XX/',
    owncloudClientId: '',
		owncloudClientSecret: '',
		owncloudClientRedirectUrl: 'http://XXX.X.X.X:XXXX/#!/'
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
    };

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
