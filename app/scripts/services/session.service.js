'use strict';

angular.module('IguassuServices').service(
	'Session',
	function ($window) {
		var session = {};
		session.user = {
			name: undefined,
		  	token: undefined,
		  	eduUsername: undefined
		};

		session.USER_COOKIE_KEY = "iguassu-user-cookie-key";
		
		function localStoreUser(user) {
      		$window.localStorage.setItem(session.USER_COOKIE_KEY, JSON.stringify(user));
    	}
		
		function getLocalStoredUser() {
		  return JSON.parse($window.localStorage.getItem(session.USER_COOKIE_KEY));
		}
    
		if (getLocalStoredUser()) {			
			if (getLocalStoredUser().eduUsername !== undefined) {				
				session.user = getLocalStoredUser();
			}
		} else {			
		  localStoreUser(session.user);
    	}

		session.createTokenSession = function (userName, userToken) {			
			let oldSession = session.getUser();			
			session.user = {
				name: oldSession.name ? oldSession.name : userName,
				eduUsername: oldSession.eduUsername,
				token: oldSession.token ? oldSession.token : userToken
			};			
      		localStoreUser(session.user);
		};

		session.destroy = function () {
			session.user = {
				name: undefined,
				token: undefined,
        		eduUsername: undefined
			};
      		localStoreUser(session.user);
		};

		session.getUser = function () {
			return getLocalStoredUser();
		};

		session.setEduUsername = function (eduUsername) {
			session.user = {
				name: undefined,
        		eduUsername: eduUsername,
        		token: undefined
      		};
      		localStoreUser(session.user);
		};
		
		return session;
	}
);