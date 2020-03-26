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

      changeStatus = function(flag){
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

      var arrayInfo=[];
      var psinfo=[];
      /* var strSSDinfo = "<table id='ssdinfo' width='100%' border='1' cellpadding='0' cellspacing='0'>"+
				"<tr><td colspan='3'><b>SSD Information</b></td></tr>"+
				"<tr><td><b>SSD NO.</b></td><td><b></b></td></tr>"+
				"<tr><td><b>type:</b></td><td><b></b></td></tr>"+
				"<tr><td><b>slot address:</b></td><td><b></b></td></tr>"+
				"<tr><td><b>status:</b></td><td><b></b></td></tr>"+
				"<tr><td><b>link speed:</b></td><td><b></b></td></tr>"+
				"<tr><td><b>link width:</b></td><td><b></b></td></tr>"+
				"<tr><td><b>configure width:</b></td><td><b></b></td></tr>"+
				"<tr><td><b>link up status:</b></td><td><b></b></td></tr>"+
				"<tr><td><b>inserted:</b></td><td><b></b></td></tr>"+
				"<tr><td><b>partition id:</b></td><td><b></b></td></tr></table>"; */

      $scope.ssdNumSelected = function(num){
        console.log(num);
        console.log(arrayInfo);
		changeStatus('ssd');
      angular.forEach(arrayInfo['Ssdinfo'], function(ssdInfo, ssdNum){
        console.log(ssdInfo);
        console.log(ssdNum);
        if(angular.equals(ssdNum, num)){
            console.log('equal');
            $scope.ssdNO = num;
            $scope.ssdDetailInfo = ssdInfo;
            console.log($scope.ssdNO);
            console.log($scope.ssdDetailInfo);
			/* var tableid = "ssdinfo";
			document.getElementById(tableid).rows[1].cells[1].innerHTML = ssdNum;
			document.getElementById(tableid).rows[1].cells[1].innerHTML = ssdInfo.Type;
			document.getElementById(tableid).rows[2].cells[1].innerHTML = ssdInfo.SlotAddr;
			document.getElementById(tableid).rows[3].cells[1].innerHTML = ssdInfo.Status;
			document.getElementById(tableid).rows[4].cells[1].innerHTML = ssdInfo.LinkSpeed;
			document.getElementById(tableid).rows[5].cells[1].innerHTML = ssdInfo.LinkWidth;
			document.getElementById(tableid).rows[6].cells[1].innerHTML = ssdInfo.ConfigureWidth;
			document.getElementById(tableid).rows[7].cells[1].innerHTML = ssdInfo.LinkStatus;
			document.getElementById(tableid).rows[8].cells[1].innerHTML = ssdInfo.Inserted;
			document.getElementById(tableid).rows[9].cells[1].innerHTML = ssdInfo.PartitionID; */
			var temp_obj = document.getElementById("ssd-info");
			var temp_tobj = document.createElement("table");
        }
      });
    };

    $scope.PowerSupply = function(name) {
        angular.forEach(psinfo['Status'], function(psInfo, psx) {
            console.log(psInfo);
            console.log(psx);
            if(angular.equals(name, psx)){
                console.log('equale');
                $scope.psName = name;
                $scope.psDetailInfo = psInfo;
                console.log($scope.psName);
                console.log($scope.psDetailInfo);
        }
        });
    }

      $scope.loadSsdInfo = function(){
        UsiAPIUtils.getSsdArrayInfo().then(
            function(data){
                arrayInfo = data;
                /* if (arrayInfo.hasOwnProperty('Ssdinfo')){
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
                } */
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
                psinfo = data;
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
