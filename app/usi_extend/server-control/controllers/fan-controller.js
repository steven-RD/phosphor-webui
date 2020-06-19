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
    '$scope', '$window', 'UsiAPIUtils', 'APIUtils', 'dataService', 'toastService', '$q','userModel',
    function($scope, $window, UsiAPIUtils, APIUtils, dataService, toastService, $q, userModel) {
		$scope.loading = false;
		
		var fans = ['Fan1_INLET', 'Fan1_OUTLET', 'Fan2_INLET', 'Fan2_OUTLET', 
					'Fan3_INLET', 'Fan3_OUTLET', 'Fan4_INLET', 'Fan4_OUTLET',
					'Fan5_INLET', 'Fan5_OUTLET'];
      $scope.fanId = 'Fan1_INLET';
      $scope.setFanSpeed = function() {
          $scope.loading = true;
		  $scope.confirmSettings = false;
		  var i = 0, j = 0;
		  if (userName=='root' && role=='Administrator'){
			  if($scope.fanId == 'ALL') {
				  for(i = 0; i < fans.length; i++) {
					  UsiAPIUtils.setFanSpeed(fans[i], $scope.speed).then(
					  function(data) {
						  console.log(JSON.stringify(data));
						  $scope.loading = false;
						  toastService.success('Set ' + fans[j] + ' speed OK!');
						  j++;
					  },
					  function(error) {
						  console.log(JSON.stringify(error));
						  $scope.loading = false;
						  toastService.error('Set ' + fans[j] + ' speed error!');
						  j++;
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
		  } else {
			  toastService.error('Permissions deny!');
		  }
      }
	  
	  $scope.refresh = function() {
		  var FanInfo=[];
		  $scope.loading = true;
		  if($scope.fanId != 'ALL'){
		    UsiAPIUtils.getFanSpeed($scope.fanId).then(
              function(data) {
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
      
	  /** add by USI steven 20200616 start **/
		var userName = '';
		var role = '';
		$scope.getLogInUserName = function() {
        userName = userModel.getUserName();
			console.log(userName);
        };
		$scope.loadUserInfo = function() {
			var users = [];
            APIUtils.getAllUserAccounts().then(
            function(res) {
                users = res;
				console.log(users);
				for(var i = 0; i < users.length; i++) {
					if(userName = users[i].UserName){
						role = users[i].RoleId;
						console.log(role);
					}
				}
            },
            function(error) {
               console.log(JSON.stringify(error));
            });
       };

      $scope.getLogInUserName();
      $scope.loadUserInfo();
      /** add by USI steven 20200616 start **/
	  $scope.refresh();

    }
  ]);
})(angular);
