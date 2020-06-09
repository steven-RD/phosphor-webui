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
    '$scope', '$window', 'UsiAPIUtils', 'APIUtils', 'dataService', 'toastService', '$q',
    function($scope, $window, UsiAPIUtils, APIUtils, dataService, toastService, $q) {
		$scope.loading = false;
		
		var fans = ['Fan1_INLET', 'Fan1_OUTLET', 'Fan2_INLET', 'Fan2_OUTLET', 
					'Fan3_INLET', 'Fan3_OUTLET', 'Fan4_INLET', 'Fan4_OUTLET',
					'Fan5_INLET', 'Fan5_OUTLET'];
      $scope.fanId = 'Fan1_INLET';
      $scope.setFanSpeed = function() {
          $scope.loading = true;
		  $scope.confirmSettings = false;
		  console.log($scope.fanId);
		  console.log($scope.speed);
		  var j = 0;
		  if($scope.fanId == 'ALL') {
			  for(j = 0; j < fans.length; j++) {
				  console.log(fans[j]);
				  UsiAPIUtils.setFanSpeed(fans[j], $scope.speed).then(
				  function(data) {
					  console.log(JSON.stringify(data));
					  $scope.loading = false;
					  console.log(fans[j]);
					  toastService.success('Set ' + fans[j] + ' speed OK!');
				  },
				  function(error) {
					  console.log(JSON.stringify(error));
					  $scope.loading = false;
					  toastService.error('Set ' + fans[j] + ' speed error!');
					  return $q.reject();
                }); 
			  }
		  } else {
			  UsiAPIUtils.setFanSpeed($scope.fanId, $scope.speed).then(
				  function(data) {
					  console.log(JSON.stringify(data));
					  $scope.loading = false;
					  toastService.success('Set ' + $scope.fanId + ' speed OK!');
					
				  },
				  function(error) {
					  console.log(JSON.stringify(error));
					  $scope.loading = false;
					  toastService.error('Set '+ $scope.fanId +' speed error!');
					  return $q.reject();
                }); 
		  }
      }
	  
	  $scope.refresh = function() {
		  var FanInfo=[];
		  $scope.loading = true;
		  if($scope.fanId != 'ALL'){
		    UsiAPIUtils.getFanSpeed($scope.fanId).then(
              function(data) {
				  console.log(JSON.stringify(data));
				  FanInfo = data;
				  $scope.speed = FanInfo["Target"];
				  $scope.loading = false;
			  },
              function(error) {
                  console.log(JSON.stringify(error));
				  $scope.loading = false;
                  return $q.reject();
                })
		  }; 
	  }
      
	  $scope.refresh();

    }
  ]);
})(angular);
