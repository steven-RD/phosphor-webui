/**
    * Controller for ssdarray
    *
    * @module app/serverControl
    * @exports powerUsageController
    * @name ssdArrayController
    *
    *
    * @author Judy
    * @date   20190524
    * @brief  ssd inventory operations modify base the file of power usage controller
*/

window.angular && (function(angular) {
    'use strict';

    angular.module('app.serverControl').controller('ssdArrayController', [
    '$scope', '$window', 'UsiAPIUtils', 'dataService', 'toastService',
    function($scope, $window, UsiAPIUtils, dataService, toastService) {
      $scope.loading = false;

      $scope.changeStatus = function(flag){
          $scope.ssdFlag = false;
          $scope.cableinfoFlag = false;
          $scope.swinfoFlag = false;
          $scope.dspFlag = false;
          $scope.patopoFlag = false;
          $scope.bindinfoFlag = false;
          $scope.psFlag = false;
          if(flag == 'ssd'){
              $scope.ssdFlag = true;
          }else if(flag == 'cable'){
              $scope.cableinfoFlag = true;
          }else if(flag == 'swinfo'){
              $scope.swinfoFlag = true;
          }else if(flag == 'dsp'){
              $scope.dspFlag = true;
          }else if(flag == 'patopo'){
              $scope.patopoFlag = true;
          }else if(flag == 'bind'){
              $scope.bindinfoFlag = true;
          }else if(flag == 'ps'){
              $scope.psFlag = true;
          }
      };

      $scope.loadSsdInfo = function(){
        UsiAPIUtils.getSsdArrayInfo().then(
            function(data){
                var arrayInfo = data['data']['Info']; // Restful interface
                //var arrayInfo = data['Info']; // Redfish interface
                if (arrayInfo.hasOwnProperty('Ssdinfo')){
                    $scope.ssdinfo = arrayInfo['Ssdinfo'];
                }
                if (arrayInfo.hasOwnProperty('Cableinfo')){
                    $scope.cableinfo = arrayInfo['Cableinfo'];
                }
                if (arrayInfo.hasOwnProperty('Dspinfo')){
                    $scope.dspinfo = arrayInfo['Dspinfo'];
                }
                if (arrayInfo.hasOwnProperty('Patopoinfo')){
                    $scope.patopoinfo = arrayInfo['Patopoinfo'];
                }
                if (arrayInfo.hasOwnProperty('Swinfo')){
                    $scope.swinfo = arrayInfo['Swinfo'];
                }
                if (arrayInfo.hasOwnProperty('Bindinfo')){
                    $scope.bindinfo = arrayInfo['Bindinfo'];
                }
            },
            function(error) {
               toastService.error('Error during getSsdArrayInfo');
            }
        );
      };
      // Get power supply info
      $scope.loadPowerSupplyInfo = function(){
        UsiAPIUtils.getPowerSupplyInfo().then(
            function(data){
                var psinfo = data['data']; // Restful interface
                //var psinfo = data; // Redfish interface
                if (psinfo.hasOwnProperty('Status')){
                    $scope.psinfo = psinfo['Status'];
                }
            },
            function(error) {
               toastService.error('Error during get PowerSupplyInfo');
            }
        );
      };

      $scope.loadSsdInfo();
      $scope.loadPowerSupplyInfo();
    }
  ]);
})(angular);
