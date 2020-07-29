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

    angular.module('app.usiExtend.help').controller('healthHelpController', [
    '$scope', '$window', 'UsiAPIUtils', 'APIUtils', 'dataService', '$q','$location','$anchorScroll',
    function($scope, $window, UsiAPIUtils, APIUtils, dataService, $q, $location, $anchorScroll) {
		$scope.loading = false;
		
    }
  ]);
})(angular);
