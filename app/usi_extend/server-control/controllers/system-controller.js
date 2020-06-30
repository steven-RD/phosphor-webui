/**
    * Controller for system control
    *
    * @module app/serverControl
    * @exports powerUsageController
    * @name fanController
    *
    *
    * @author Steven
    * @date   20200417
    * @brief  control AFA and power switch
*/

window.angular && (function(angular) {
    'use strict';

    angular.module('app.serverControl').controller('systemController', [
    '$scope', '$window', 'UsiAPIUtils', 'APIUtils', 'dataService', 'toastService', '$q',
    function($scope, $window, UsiAPIUtils, APIUtils, dataService, toastService, $q) {


	$scope.rebootConfirm = function() {
        if ($scope.confirmreboot) {
			return;
	    }
        $scope.confirmreboot = true;
    };

    $scope.reboot = function() {
        APIUtils.bmcReboot().then(
            function(response) {
                toastService.success('AFA is rebooting.')
            },
             function(error) {
                 console.log(JSON.stringify(error));
                 toastService.error('Unable to reboot AFA.');
          });
    };

/*      $scope.toggleSwitchPower = function() {
        var toggleState =($scope.switch_state == 'Power On') ? 'poweroff switch' : 'poweron switch';
		$scope.State = toggleState;
		$scope.confirmSettings = false;
		console.log(toggleState);
        UsiAPIUtils.setPowerSwitchState(toggleState).then(
        function(data) {
           UsiAPIUtils.getPowerSwitchStatus().then(
              function(info){
                  $scope.switch_state = info.Status;
                  console.log($scope.switch_state);
              },
              function(error) {
                  console.log(JSON.stringify(error));
                  toastService.error('Get power switch status error!');
              });
        },
        function(error) {
            console.log(JSON.stringify(error));
            toastService.error(toggleState + 'error!');
        });
      };  */

     $scope.poweronConfirm = function() {
        if ($scope.confirmPowerOn) {
            return;
        }
        $scope.confirmPowerOn = true;
    };
    $scope.poweroffConfirm = function() {
        if ($scope.confirmPowerOff) {
            return;
        }
        $scope.confirmPowerOff = true;
    };

    $scope.toggleSwitchPower = function(cmd) {
        UsiAPIUtils.setPowerSwitchState(cmd).then(
        function(data) {
           UsiAPIUtils.getPowerSwitchStatus().then(
              function(info){
                  $scope.switch_state = info.Status;
                  console.log($scope.switch_state);
              },
              function(error) {
                  console.log(JSON.stringify(error));
              });
        },
        function(error) {
            console.log(JSON.stringify(error));
        });
    };

    $scope.PowerSwitchStatus = function() {
        UsiAPIUtils.getPowerSwitchStatus().then(
              function(info){
                  $scope.switch_state = info.Status;
                  console.log($scope.switch_state);
              },
              function(error) {
                  console.log(JSON.stringify(error));
              }); 
      }

    $scope.PowerSwitchStatus(); 

    }
  ]);
})(angular);
