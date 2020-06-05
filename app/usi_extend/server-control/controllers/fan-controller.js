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
					   'Fan5_INLET', 'Fan5_OUTLET', 'Fan6_INLET', 'Fan6_OUTLET', 'ALL'];
        $scope.fanId = 'Fan1_INLET';
      $scope.setFanSpeed = function() {
          $scope.loading = true;
		  $scope.confirmSettings = false;
		  console.log($scope.fanId)
		  console.log($scope.speed)
          UsiAPIUtils.setFanSpeed($scope.fanId, $scope.speed).then(
              function(data) {
				  console.log(JSON.stringify(data));
				  console.log("setFanSpeed");
				  $scope.loading = false;
			  },
              function(error) {
                  console.log(JSON.stringify(error));
				  $scope.loading = false;
                  return $q.reject();
                }); 
      }
	  
	  $scope.refresh = function() {
		  var FanInfo=[];
		  $scope.loading = true;
		  UsiAPIUtils.getFanSpeed($scope.fanId).then(
              function(data) {
				  console.log("getFanSpeed");
				  console.log(JSON.stringify(data));
				  FanInfo = data;
				  $scope.speed = FanInfo["Target"];
				  $scope.loading = false;
			  },
              function(error) {
                  console.log(JSON.stringify(error));
				  $scope.loading = false;
                  return $q.reject();
                }); 
	  }
      
	  $scope.refresh();

    }
  ]);
})(angular);
