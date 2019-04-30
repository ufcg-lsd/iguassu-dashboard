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
  var alreadyLoggedIn = function($location, AuthenticationService) {
    var user = AuthenticationService.getUser();    
    if (Object.getOwnPropertyNames(user).length != 0) {                 
      if (user.name && user.token && user.refreshToken) {                        
        $location.path("/tasks");    
        
      } 
    } else {
      $location.path("/");
    }
  }

  var checkUser = function($location, AuthenticationService) {
    var user = AuthenticationService.getUser();    
    if (Object.getOwnPropertyNames(user).length != 0) {                 
      if (user.name) {                        
        $location.path($location.url());    
        
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
    .otherwise({
      redirectTo: "/"
    });
});
