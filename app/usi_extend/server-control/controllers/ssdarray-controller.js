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

	  function changeStatus(flag){
          $scope.ssdFlag = false;
          $scope.cableinfoFlag = false;
          $scope.swinfoFlag = false;
          $scope.psFlag = false;
          if(flag == 'ssd'){
              $scope.ssdFlag = true;
          }else if(flag == 'cable'){
              $scope.cableinfoFlag = true;
          }else if(flag == 'swinfo'){
              $scope.swinfoFlag = true;
          }else if(flag == 'ps'){
              $scope.psFlag = true;
          }
      };
	  
      var arrayInfo=[];
      var PSInfo=[];
	  $scope.leave = function(id){
		  $scope.ssdFlag = false;
          $scope.cableinfoFlag = false;
          $scope.swinfoFlag = false;
          $scope.psFlag = false;
	      var lab = document.getElementById(id);
		  console.log('leave');
		  console.log(lab);
		  lab.style.display = "none";
	  };
	  
	  ///ssd information
      $scope.ssdNumSelected = function(num){
      angular.forEach(arrayInfo['Ssdinfo'], function(ssdInfo, ssdNum){
        console.log(ssdInfo);
        console.log(ssdNum);
        if(angular.equals(ssdNum, num)){
            console.log('equal');
			$scope.ssdNo=ssdNum;
			$scope.ssdx=ssdInfo;
			changeStatus('ssd');
			
			var lab = document.getElementById('usi-ssd');
			var windowEvent = window.event;               ///Get windowEvent
			var mousePosition = getMousePos(windowEvent); ///Get mouse position
			lab.style.display="block";
			lab.style.left = mousePosition.x + 'px';
			lab.style.top = mousePosition.y + 'px';	
			console.log(mousePosition.x + 'px');
			console.log(mousePosition.y + 'px');
			console.log(lab);
        }
      });
    };

	///ps information
    $scope.PowerSupply = function(name) {
		changeStatus('ps');
		var lab=document.getElementById('usi-ps');
		var windowEvent = window.event;               ///Get windowEvent
		var mousePosition = getMousePos(windowEvent); ///Get mouse position
		lab.style.display="block";
		lab.style.left = mousePosition.x + 'px';
		lab.style.top = mousePosition.y + 'px';
		console.log(lab);
		
		if(angular.equals(name, 'PS')) {
			$scope.psinfo=PSInfo['Status'];
			console.log($scope.psinfo);
		}else{
			angular.forEach(PSInfo['Status'], function(psInfo, psName) {
				if(angular.equals(psName, name)) {
					$scope.psinfo=psInfo;
					console.log($scope.psinfo);
				}
			});
		}
    };

	///cable information
	$scope.Cable = function(name) {
		changeStatus('cable');
		console.log(name);
        console.log(arrayInfo);
		$scope.cableinfo=arrayInfo['Cableinfo'];
		var lab=document.getElementById('usi-cable');
		var windowEvent = window.event;               ///Get windowEvent
		var mousePosition = getMousePos(windowEvent); ///Get mouse position
		lab.style.display="block";
		lab.style.left = mousePosition.x + 'px';
		lab.style.top = mousePosition.y + 'px';
		//lab.style.left = x + 'px';
		//lab.style.top = y + 'px';
		console.log(mousePosition.x + 'px');
		console.log(mousePosition.y + 'px');
		console.log(lab);
	};
	
	///switch information
	$scope.Switch = function(name) {
		changeStatus('swinfo');
		$scope.swinfo = arrayInfo['Swinfo'];
		var lab = document.getElementById('usi-switch');
		//var windowEvent = window.event;              ///Get windowEvent
		var mousePosition = getMousePos(window.event); ///Get mouse position
		lab.style.display="block";		
		lab.style.left = mousePosition.x + 'px';
		lab.style.top = mousePosition.y + 'px';
		//lab.style.left = x + 'px';
		//lab.style.top = y + 'px';
		console.log(mousePosition.x + 'px');
		console.log(mousePosition.y + 'px');
		console.log(lab);
	};
	
	  ///arrow loop
	  var index = 0;
      var imgElement = document.getElementById("imgs").getElementsByTagName("li");
	  console.log(imgElement);
      var imgLen = imgElement.length;
      $scope.moveNext = function(arrow){
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
                /*   $scope.ssdinfo = arrayInfo['Ssdinfo'];
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
                PSInfo = data;
                /* if (psinfo.hasOwnProperty('Status')){
                    $scope.psinfo = psinfo['Status'];
                } */
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
