'use strict';

/**
 * @ngdoc service
 * @name ArrebolApp.ArrebolApi
 * @description
 * # ArrebolApi
 * Arrebol Api Service.
 */
angular.module('ArrebolApp')
  .factory('ArrebolApi', function ($http, hex2a, toastr, arrebolConfig) {
    return {
    	jobEndpoint: '/arrebol/job',
    	nonceEndpoint: '/arrebol/nonce',
    	getJobs: function(authType, username, password, successCallback, errorCallback) {
    		var that = this;
    		this.auth(authType, username, password, function (credentials) {
				$http.get(arrebolConfig.arrebolServiceBaseUrl + that.jobEndpoint, {headers: { 'X-auth-credentials': JSON.stringify(credentials) } })
			    .success(function(data) {
			    	successCallback(data);
			    }).error(function (error) {
			    	errorCallback(error);
			    });
    		});
    	},
    	getJob: function(jobId, authType, username, password, successCallback, errorCallback) {
    		var that = this;
    		this.auth(authType, username, password, function (credentials) {
    			$http.get(arrebolConfig.arrebolServiceBaseUrl + that.jobEndpoint + '/' + jobId, {headers: { 'X-auth-credentials': JSON.stringify(credentials) } })
			    .success(function(data) {
			    	successCallback(data);
			    }).error(function (error) {
			    	errorCallback(error);
			    });
    		});
    	},
    	deleteJob: function(jobId, authType, username, password, successCallback, errorCallback) {
    		var that = this;
    		this.auth(authType, username, password, function (credentials) {
    			$http.delete(arrebolConfig.arrebolServiceBaseUrl + that.jobEndpoint + '/' + jobId, {headers: { 'X-auth-credentials':  JSON.stringify(credentials)} })
				.success(function(data) {
			    	successCallback(data);
			    }).error(function (error) {
			    	errorCallback(error);
			    });
    		});
    	},
    	getNonce: function(callback) {
    		$http.get(arrebolConfig.arrebolServiceBaseUrl + this.nonceEndpoint)
	        .success(function(nonce) {
	          callback(nonce);
	        }).error(function (error) {
	          toastr.error('Error code: ' + error.code + ', Description: ' + error.description, 'Error while trying to connect to arrebol server.');
	        });
    	},
    	auth: function (authType, username, password, callback) {
    		if (authType === 'commonauth') {
    			this.commonAuth(username, password, callback);
    		} else if (authType === 'ldapauth') {
    			this.ldapAuth(username, password, callback);
    		}
    	},
    	commonAuth: function(username, privateKey, callback) {
    		this.getNonce(function(nonce) {
	          /* global RSAKey */
	          var rsa = new RSAKey();
	          rsa.readPrivateKeyFromPEMString(privateKey);
	          var hash = rsa.signString(username + nonce, 'sha1');
	          hash = hex2a(hash);
	          hash = window.btoa(hash);
	          var credentials = {'username': username, 'password': hash, 'nonce': nonce};
	          callback(credentials);
	        });
    	},
    	ldapAuth: function(username, password, callback) {
    		this.getNonce(function(nonce) {
	          var credentials = {'username': username, 'password': password, 'nonce': nonce};
	          callback(credentials);
	        });
    	}
    };
  });
