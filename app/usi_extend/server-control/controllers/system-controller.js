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

    angular.module('app.serverControl').controller('systemController', [
    '$scope', '$window', 'UsiAPIUtils', 'APIUtils', 'dataService', '$q',
    function($scope, $window, UsiAPIUtils, APIUtils, dataService, $q) {
    
	$scope.rebootConfirm = function() {
        if ($scope.confirm) {
			return;
	    }
        $scope.confirm = true;
    };

    $scope.reboot = function() {
        APIUtils.bmcReboot().then(
            function(response) {
                toastService.success('BMC is rebooting.')
            },
             function(error) {
				console.log(JSON.stringify(error));
				toastService.error('Unable to reboot BMC.');
          });
    };
	
	$scope.toggleSwitchPower = function() {
      /*
        Set power switch state.
        if success, get power switch status and update.
      */
     var toggleState =($scope.switch_state == 'Power On') ? 'poweroff switch' : 'poweron switch';
     UsiAPIUtils.setPowerSwitchState(toggleState).then(
        function(data) {
           UsiAPIUtils.getPowerSwitchStatus().then(
              function(info){
                  $scope.switch_state = info.Status;
                  console.log(switch_state);
              },
              function(error) {
                  console.log(JSON.stringify(error));
              });
        },
        function(error) {
            console.log(JSON.stringify(error));
        });
      };

    }
  ]);
})(angular);
