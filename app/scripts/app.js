"use strict";

/**
 * @ngdoc overview
 * @name ArrebolApp
 * @description
 * # ArrebolApp
 *
 * Main module of the application.
 */
var app = angular.module("ArrebolApp", [
  "ArrebolControllers",
  "ArrebolServices",
  "ngAnimate",
  "ngCookies",
  "ngResource",
  "ngRoute",
  "ngSanitize",
  "ngTouch",
  "ui.bootstrap",
  "toastr"
]);

angular.module("ArrebolControllers", ["ngResource"]);
angular.module("ArrebolServices", ["ngResource"]);

// Import variables if present (from env.js)
var env = {};
if (window) {
  Object.assign(env, window.__env);
}

app.constant("appConfig", {
  host: env.host,
  jobEndpoint: env.host,
  nonceEndpoint: env.jobEndpoint,
  oAuthEndpoint: env.oAuthEndpoint,
  iguassuServerHost: env.iguassuServerHost,
  owncloudServerUrl: env.owncloudServerUrl,
  owncloudClientId: env.owncloudClientId,
  owncloudClientSecret: env.owncloudClientSecret,
  owncloudClientRedirectUrl: env.owncloudClientRedirectUrl,
  nafAuthUrl: env.nafAuthUrl
});

app.config(function($routeProvider) {
  var checkUser = function($location, AuthenticationService) {
    if (!AuthenticationService.checkCAFeUser()) {
      $location.path("/");
    }
  };

  var alreadyLoggedIn = function($location, AuthenticationService) {
    if (
      AuthenticationService.checkIfUrlHasCAFeEduUsername() ||
      AuthenticationService.checkCAFeUser()
    ) {
      var user = AuthenticationService.getUser();
      if (user.name) {
        $location.url("/tasks");
      } else {
        $location.url("/owncloud");
      }
    } else {
      $location.path("/");
    }
  };

  $routeProvider
    .when("/", {
      templateUrl: "views/login.html",
      resolve: {
        check: alreadyLoggedIn
      },
      controller: "AuthCtrl"
    })
    .when("/tasks", {
      templateUrl: "views/main.html",
      resolve: {
        check: alreadyLoggedIn
      },
      controller: "MainCtrl"
    })
    .when("/tasks/:job", {
      templateUrl: "views/tasks.html",
      resolve: {
        check: checkUser
      },
      controller: "TasksCtrl"
    })
    .when("/owncloud", {
      templateUrl: "views/authowncloud.html",
      resolve: {
        check: alreadyLoggedIn
      },
      controller: "AuthCtrl"
    })
    .otherwise({
      redirectTo: "/tasks"
    });
});
