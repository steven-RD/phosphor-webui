/**
    * Controller for help
    *
    * @module app/help
    * @exports helpController
    * @name helpController
    *
    *
    * @author Steven
    * @date   20200520
    * @brief  help doc
*/

window.angular && (function(angular) {
    'use strict';

    angular.module('app.usiExtend.help').controller('helpController', [
    '$scope', '$window', 'UsiAPIUtils', 'APIUtils', 'dataService', '$q',
    function($scope, $window, UsiAPIUtils, APIUtils, dataService, $q) {
		$scope.loading = false;

    }
  ]);
})(angular);
