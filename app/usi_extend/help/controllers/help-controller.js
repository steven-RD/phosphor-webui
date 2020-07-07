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
    '$scope', '$window', 'UsiAPIUtils', 'APIUtils', 'dataService', '$q','$location','$anchorScroll',
    function($scope, $window, UsiAPIUtils, APIUtils, dataService, $q, $location, $anchorScroll) {
		$scope.loading = false;
		
	   // Scroll to target anchor
      $scope.sensorAnchor = function() {
        $location.hash('usisensors');
        $anchorScroll();
      };
	  
	  // Scroll to target anchor
      $scope.hardwareAnchor = function() {
        $location.hash('usihardwarestatus');
        $anchorScroll();
      };
	  
	   // Scroll to target anchor
      $scope.gotoAnchor = function(id) {
        $location.hash(id);
        $anchorScroll();
      };

    }
  ]);
})(angular);
