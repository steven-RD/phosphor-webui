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
    '$scope', '$window', 'UsiAPIUtils', 'APIUtils', 'dataService', '$q',
    function($scope, $window, UsiAPIUtils, APIUtils, dataService, $q) {
		$scope.loading = false;
		
		$scope.fans = ['Fan1_INLET', 'Fan1_OUTLET', 'Fan2_INLET', 'Fan2_OUTLET', 
							 'Fan3_INLET', 'Fan3_OUTLET', 'Fan4_INLET', 'Fan4_OUTLET',
							 'Fan5_INLET', 'Fan5_OUTLET', 'Fan6_INLET', 'Fan6_OUTLET'];

      $scope.setFanSpeed = function() {
          $scope.loading = true;
		  console.log($scope.fanId)
		  console.log($scope.speed)
          UsiAPIUtils.setFanSpeed($scope.fanId, $scope.speed).then(
              function(data) {},
              function(error) {
                  console.log(JSON.stringify(error));
                  return $q.reject();
                });
      }


    }
  ]);
})(angular);
