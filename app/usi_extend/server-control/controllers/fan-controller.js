/**
    * Controller for fan
    *
    * @module app/serverControl
    * @exports powerUsageController
    * @name fanController
    *
    *
    * @author Steven
    * @date   20200417
    * @brief  control fan speed
*/

window.angular && (function(angular) {
    'use strict';

    angular.module('app.serverControl').controller('fanController', [
    '$scope', '$window', 'UsiAPIUtils', 'APIUtils', 'dataService', 'toastService',
    function($scope, $window, UsiAPIUtils, APIUtils, dataService, toastService) {
		$scope.loading = false;
		
		$scope.fanOwners = ['Fan1_INLET', 'Fan1_OUTLET', 'Fan2_INLET', 'Fan2_OUTLET', 
							 'Fan3_INLET', 'Fan3_OUTLET', 'Fan4_INLET', 'Fan4_OUTLET',
							 'Fan5_INLET', 'Fan5_OUTLET', 'Fan6_INLET', 'Fan6_OUTLET'];
		
		$scope.setFanSpeed = function() {
			$scope.loading = true;
			console.log($scope.fan.owner);
			var data = {};
			if ($scope.Fan1_INLET != '') {
				data[$scope.fan.owner] = $scope.Fanx;
            }
			
		};

		$scope.setFanSpeed();

      
    }
  ]);
})(angular);
