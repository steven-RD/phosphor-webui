/**
    * Controller for partition
    *
    * @module app/serverControl
    * @exports powerUsageController
    * @name fanController
    *
    *
    * @author Steven
    * @date   20200423
    * @brief  control partition speed
*/

window.angular && (function(angular) {
    'use strict';

    angular.module('app.serverControl').controller('partitionController', [
    '$scope', '$window', 'UsiAPIUtils', 'APIUtils', 'dataService', 'toastService',
    function($scope, $window, UsiAPIUtils, APIUtils, dataService, toastService) {
      $scope.loading = false;

		
    }
  ]);
})(angular);
