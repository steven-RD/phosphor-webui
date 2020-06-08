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

    }
  ]);
})(angular);
