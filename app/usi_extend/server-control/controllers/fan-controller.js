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
		
		$scope.setFanSpeed = function() {
			$scope.loading = true;
			var data = {};
			if ($scope.Fan1_INLET != '') {
				data['Fan1_INLET'] = $scope.Fan1_INLET;
            }
			if ($scope.Fan1_OUTLET != '') {
				data['Fan1_OUTLET'] = $scope.Fan1_OUTLET;
            }
			
		};

	

      
    }
  ]);
})(angular);
