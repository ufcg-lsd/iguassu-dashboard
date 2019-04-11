'use strict';

angular.module('IguassuServices').service(
	'Session',
	function ($window, $route) {
		var session = {};
		session.user = {
			name: undefined,
		  	token: undefined,		  	
		};

		session.USER_COOKIE_KEY = "iguassu-user-cookie-key";
		
		function localStoreUser(user) {
      		$window.localStorage.setItem(session.USER_COOKIE_KEY, JSON.stringify(user));
    	}
		
		function getLocalStoredUser() {
		  return JSON.parse($window.localStorage.getItem(session.USER_COOKIE_KEY));
		}
    
		if (getLocalStoredUser()) {	
			session.user = getLocalStoredUser();	
		} else {			
		  localStoreUser(session.user);
		}		

		session.createTokenSession = function (userName, userToken) {			
			let oldSession = session.getUser();			
			session.user = {
				name: oldSession.name ? oldSession.name : userName,
				token: oldSession.token ? oldSession.token : userToken
			};			
      		localStoreUser(session.user);
		};

		session.destroy = function () {
			session.user = {
				name: undefined,
				token: undefined
			};
			localStoreUser(session.user);
			$route.reload();
		};

		session.getUser = function () {
			return getLocalStoredUser();
		};
		
		return session;
	}
);