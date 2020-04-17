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
    '$scope', '$window', 'UsiAPIUtils', 'APIUtils', 'dataService', 'toastService',
    function($scope, $window, UsiAPIUtils, APIUtils, dataService, toastService) {
      $scope.loading = false;

	  function changeStatus(flag){
          $scope.ssdFlag = false;
          $scope.cableFlag = false;
          $scope.switchFlag = false;
          $scope.psFlag = false;
		  $scope.psxFlag = false;
		  $scope.fanFlag = false;
		  $scope.patopoFlag = false;
		  $scope.ipFlag = false;
          if(flag == 'ssd'){
              $scope.ssdFlag = true;
          }else if(flag == 'cable'){
              $scope.cableFlag = true;
          }else if(flag == 'sw'){
              $scope.switchFlag = true;
          }else if(flag == 'ps'){
              $scope.psFlag = true;
          }else if(flag == 'psx'){
              $scope.psxFlag = true;
          }else if(flag == 'fan'){
              $scope.fanFlag = true;
          }else if(flag == 'patopo'){ 
              $scope.patopoFlag = true;
          }else if(flag == 'ip'){
              $scope.ipFlag = true;
          }
      };
	  
	  $scope.leave = function(id){
		  $scope.ssdFlag = false;
          $scope.cableFlag = false;
          $scope.switchFlag = false;
          $scope.psFlag = false;
		  $scope.psxFlag = false;
		  $scope.fanFlag = false;
		  $scope.patopoFlag = false;
		  $scope.ipFlag = false;
	      var lab = document.getElementById(id);
		  lab.style.display = "none";
	  };
	 
      var arrayInfo=[];
      var PSInfo=[];
	  ///ssd information
      $scope.SSD = function(num){
      angular.forEach(arrayInfo['Ssdinfo'], function(ssdInfo, ssdNum){
        if(angular.equals(ssdNum, num)){
			$scope.ssdNo=ssdNum;
			$scope.ssdx=ssdInfo;
			changeStatus('ssd');
						
			var lab = document.getElementById('usi-ssd');
			var mousePosition = getMousePos(window.event); ///Get mouse position
			lab.style.position = "absolute";
			lab.style.display = "block";
			lab.style.left = mousePosition.x + 5 + 'px';
			lab.style.top = mousePosition.y  + 5 +  'px';
			lab.style.height = '0px';
			lab.style.width = '0px';	
        }
      });
    };

	///ps information
    $scope.PowerSupply = function(name) {		
		
		if(angular.equals(name, 'PS')) {
			changeStatus('ps');
			$scope.psinfo=PSInfo['Status'];	
			var lab = document.getElementById('usi-ps');
			var mousePosition = getMousePos(window.event); ///Get mouse position
			lab.style.position = "absolute";
			lab.style.display = "block";
			lab.style.left = mousePosition.x + 5 + 'px';
			lab.style.top = mousePosition.y + 5 + 'px';
			lab.style.height = '0px';
			lab.style.width = '0px';
		}else{
			angular.forEach(PSInfo['Status'], function(psInfo, psName) {				
				if(angular.equals(psName, name)) {
					changeStatus('psx');				
					$scope.psname=psName;
					$scope.psinfo=psInfo;
					var lab = document.getElementById('usi-psx');
					var mousePosition = getMousePos(window.event); ///Get mouse position
					lab.style.position = "absolute";
					lab.style.display= "block";
					lab.style.height = '0px';
					lab.style.width = '0px';
					lab.style.left = mousePosition.x + 5 + 'px';
					lab.style.top = mousePosition.y + 5 + 'px';
				}
			});
		}
    };

	///cable information
	$scope.Cable = function() {
		changeStatus('cable');
		$scope.cableinfo = arrayInfo['Cableinfo'];
		var lab = document.getElementById('usi-cable');
		var mousePosition = getMousePos(window.event); ///Get mouse position
		
		lab.style.position = "absolute";
		lab.style.display = "block";
		lab.style.left = mousePosition.x + 5 + 'px';
		lab.style.top = mousePosition.y + 5 + 'px';
		lab.style.height = '0px';
		lab.style.width = '0px';
	};
	
	///switch information
	$scope.Switch = function() {
		changeStatus('sw');
		$scope.swinfo = arrayInfo['Swinfo'];
		var lab = document.getElementById('usi-switch');
		var mousePosition = getMousePos(window.event); ///Get mouse position
		lab.style.position = "absolute";
		lab.style.display = "block";
		lab.style.height = '0px';
		lab.style.width = '0px';	
		lab.style.left = mousePosition.x + 5 + 'px';
		lab.style.top = mousePosition.y + 5 + 'px';
		
	};
	
	$scope.Patopo = function() {
		changeStatus('patopo');
		$scope.patopoinfo = arrayInfo['Patopoinfo'];
		var lab = document.getElementById('usi-patopo');
		var mousePosition = getMousePos(window.event); ///Get mouse position
		lab.style.position = "absolute";
		lab.style.display = "block";
		lab.style.height = '0px';
		lab.style.width = '0px';
		lab.style.left = mousePosition.x + 5 + 'px';
		lab.style.top = mousePosition.y + 5 + 'px';
		console.log("patopo"); 
		console.log($scope.patopoinfo); 
	};
	
	$scope.Ip = function() {
		changeStatus('ip');
		var lab = document.getElementById('usi-ip');
		var mousePosition = getMousePos(window.event); ///Get mouse position
		lab.style.position = "absolute";
		lab.style.display = "block";
		lab.style.height = '0px';
		lab.style.width = '0px';
		lab.style.left = mousePosition.x + 5 + 'px';
		lab.style.top = mousePosition.y + 5 + 'px';
		console.log("ip"); 
		console.log($scope.bmc_ip_addresses); 
	};
	
	///fan sensor information
	$scope.Fan = function(name) {
		changeStatus('fan');
		var lab = document.getElementById('usi-fan');
		var mousePosition = getMousePos(window.event); ///Get mouse position
		lab.style.position = "absolute";
		lab.style.display = "block";
		lab.style.left = mousePosition.x + 5 + 'px';
		lab.style.top = mousePosition.y + 5 + 'px'; 
		lab.style.height = '0px';
		lab.style.width = '0px';

		for(var i = 0; i < fanData.length; i++){
			if(fanData[i].title.indexOf(name+' INLET') != -1) {
				$scope.faninfoIN=fanData[i];
				console.log($scope.faninfoIN);
			}else if(fanData[i].title.indexOf(name+' OUTLET') != -1){
				$scope.faninfoOUT=fanData[i];
				console.log($scope.faninfoOUT);
			}
		}
	  };
	  
	  ///arrow loop
	  var index = 0;
      var imgElement = document.getElementById("imgs").getElementsByTagName("li");
	  console.log(imgElement);
      var imgLen = imgElement.length;
      $scope.moveNext = function(arrow){
		  $scope.ssdFlag = false;
          $scope.cableFlag = false;
          $scope.switchFlag = false;
          $scope.psFlag = false;
		  $scope.psxFlag = false;
		  $scope.fanFlag = false;
		  $scope.patopoFlag = false;
		  $scope.ipFlag = false;
		  if(arrow == 'right'){
			index++;
			if (index == imgLen){
				index = 0; // The first image
			}
			angular.element(imgElement).eq(index-1).addClass('img_display');
			angular.element(imgElement).eq(index).removeClass('img_display');
		  }else if(arrow == 'left'){
			index--;
			if (index == -1){
				index = imgLen - 1; // The last image
			}
			if (index == 2){
				angular.element(imgElement).eq(0).addClass('img_display');
			}else{
				angular.element(imgElement).eq(index+1).addClass('img_display');
			}
			angular.element(imgElement).eq(index).removeClass('img_display');
		  }
	  };
	   
	  // Get mouse relative position
      function getMousePos(event) {
          var scrollX = document.documentElement.scrollLeft || document.body.scrollLeft;
          var scrollY = document.documentElement.scrollTop || document.body.scrollTop;
		  //var x = event.pageX || event.clientX + scrollX;
		  //var y = event.pageY || event.clientY + scrollY;
		  var x = event.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
		  var y = event.clientY+ document.body.scrollTop + document.documentElement.scrollTop;
		  return { 'x': x, 'y': y };
      }
	
      $scope.loadSsdInfo = function(){
        UsiAPIUtils.getSsdArrayInfo().then(
            function(data){
                arrayInfo = data;
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
                PSInfo = data;
            },
            function(error) {
               toastService.error('Error during get PowerSupplyInfo');
            }
        );
      };
	  
      var fanData = [];
	  $scope.loadFanSensorData = function(){
          APIUtils.getAllSensorStatus(function(data, originalData) {
              for(var i = 0; i < data.length; i++){
                  if(data[i].title.indexOf('Fan') != -1 &&  data[i].title.indexOf('Tach') != -1){
                      fanData.push(data[i]);
                  }
              }
         });
	  };
	  
	  $scope.bmc_ip_addresses = [];
	  $scope.loadNetworkInfo = function(){
		 APIUtils.getNetworkInfo().then(
            function(data) {
              // TODO: openbmc/openbmc#3150 Support IPV6 when
              // officially supported by the backend
              $scope.bmc_ip_addresses = data.formatted_data.ip_addresses.ipv4;
              //$scope.newHostname = data.hostname;
            },
            function(error) {
              console.log(JSON.stringify(error));
            }); 
	  };

      $scope.loadSsdInfo();
      $scope.loadPowerSupplyInfo();
	  $scope.loadFanSensorData();
	  $scope.loadNetworkInfo ();
    }
  ]);
})(angular);
