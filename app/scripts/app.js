"use strict";

/**
 * @ngdoc overview
 * @name IguassuApp
 * @description
 * # IguassuApp
 *
 * Main module of the application.
 */
var app = angular.module("IguassuApp", [
  "IguassuControllers",
  "IguassuServices",
  "ngAnimate",
  "ngCookies",
  "ngResource",
  "ngRoute",
  "ngSanitize",
  "ngTouch",
  "ui.bootstrap",
  "toastr"
]);

angular.module("IguassuControllers", ["ngResource"]);
angular.module("IguassuServices", ["ngResource"]);

// Import variables if present (from env.js)
var env = {};
if (window) {
  Object.assign(env, window.__env);
}

app.constant(
  'appConfig',
  {
    host: env.host,
    jobEndpoint: env.jobEndpoint,
    nonceEndpoint: env.nonceEndpoint,
    oAuthEndpoint: env.oAuthEndpoint,
    iguassuServerHost: env.iguassuServerHost,
    owncloudServerUrl: env.owncloudServerUrl,
    owncloudClientId: env.owncloudClientId,
    owncloudClientSecret: env.owncloudClientSecret,
    owncloudClientRedirectUrl: env.owncloudClientRedirectUrl,
    nafAuthUrl: env.nafAuthUrl
  }
);

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
      console.log("Check if has Cafe edu username: " + AuthenticationService.checkIfUrlHasCAFeEduUsername());
      console.log("User info: " + user.name);
      console.log("CheckCafeUser : " + AuthenticationService.checkCAFeUser());
      if (user.name) { 
        $location.url("/tasks");
      } 
    } else {
      $location.path("/");
    }
  };

  $routeProvider
    .when("/", {
      templateUrl: "views/authowncloud.html",
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
      controller: "JobsCtrl"
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
