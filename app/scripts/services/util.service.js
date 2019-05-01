'use strict';

angular.module('IguassuServices').service(
	'UtilService',
	function () {
        var utilService = {};
        let refreshIntervals = [];

		utilService.addIntervalId = function (intervalId) {
			refreshIntervals.push(intervalId);
        };
        
        utilService.clearIntervalsIds = function () {
            refreshIntervals.forEach( function(intervalId) {
                clearInterval(intervalId);
            });
        };
		
		return utilService;
	}
);