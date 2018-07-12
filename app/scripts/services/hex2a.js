'use strict';

/**
 * @ngdoc service
 * @name ArrebolApp.jobs
 * @description
 * # jobs
 * Factory in the ArrebolApp.
 */
angular.module('ArrebolApp')
  .factory('hex2a', function () {
    return function (hex) {
      var str = '';
      for (var i = 0; i < hex.length; i += 2) {
        str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
      }
      return str;
    };
  });
