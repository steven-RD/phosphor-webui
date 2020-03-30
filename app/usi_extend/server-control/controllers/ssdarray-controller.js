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

 /*      $scope.changeStatus = function(flag){
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
      }; */

      var arrayInfo=[];
      var psinfo=[];
	  $scope.leave = function(id){
	      var lab = document.getElementById(id);
		  lab.style.display="none";
	  };
	  
	  ///ssd information
      $scope.ssdNumSelected = function(num){
      angular.forEach(arrayInfo['Ssdinfo'], function(ssdInfo, ssdNum){
        console.log(ssdInfo);
        console.log(ssdNum);
        if(angular.equals(ssdNum, num)){
            console.log('equal');
			
			var lab = document.getElementById(ssdNum);
		    var description = ["SSD NO.", "Address", "Type", "Status", "Link Speed", "Link Width", 
				"Link Status", "Inserted", "Partition ID", "Configure Width"];
            var ssd = [ssdNum, ssdInfo.SlotAddr, ssdInfo.Type, ssdInfo.Status, ssdInfo.LinkSpeed, 
				ssdInfo.LinkWidth, ssdInfo.LinkStatus, ssdInfo.Inserted, ssdInfo.PartitionID, ssdInfo.ConfigureWidth];
		    var tab='<table border=1 align="center" >'
		    tab+="<tr><td align='center' valian='middle' colspan='2'><b>SSD Information</b></td></tr>"
            for ( var row = 0; row < description.length; row++){
                tab+='<tr>'
                for ( var col = 0; col < 2; col++){
                if(col == 0){
					tab+="<td style='background:green'>"+description[row]+"</td>"
				} else {
					tab+="<td style='background:green'>"+ssd[row]+"</td>"
				}
             }
             tab+='</tr>'
         }    
         tab+='</table>';
         lab.innerHTML=tab;
		 lab.style.display="";
        }
      });
    };

	///ps information
    $scope.PowerSupply = function(name) {
        angular.forEach(psinfo['Status'], function(psInfo, psx) {
            console.log(psInfo);
            console.log(psx);
            if(angular.equals(name, psx)){
                console.log('equael');
                console.log(name);
                console.log(psInfo);
				
				var lab=document.getElementById(ssdNum);
				var tab='<table border=1 align="center">'
			    tab+="<tr><td align='center' valian='middle' colspan='2'><b>PowerSupplya Information</b></td></tr>"
				tab+='<tr>'
				tab+="<td style='background:green'>"+name+"</td>"
				tab+="<td style='background:green'>"+psInfo+"</td>"				
				tab+='</tr>'  
				tab+='</table>';
				lab.innerHTML=tab;
				lab.style.display="";
			}
        });
    };

	///cable information
	$scope.Cable = function(name) {
		console.log(name);
        console.log(arrayInfo);
        angular.forEach(arrayInfo['Cableinfo'], function(cableInfo, cableNum){
			console.log(cableInfo);
			console.log(cableNum);
			if(angular.equals(cableNum, name)){
				console.log('equal');
				
				var lab=document.getElementById(name);
				var description = ["SSD NO.", "Status", "Cable Type", "Slot Addr", "Partition ID",
					"Link Status", "Link Active", "Link Width", "Physical Port", "UspDsp", "Present"];
				var cable = [name, cableInfo.Status, cableInfo.CableType, cableInfo.SlotAddr, cableInfo.PartitionID, cableInfo.LinkStatus, 
					cableInfo.LinkActive, cableInfo.LinkWidth, cableInfo.PhysicalPort, cableInfo.UspDsp, cableInfo.Present];
				var tab='<table border=1 align="center">'
				
				tab+="<tr><td align='center' valian='middle' colspan='2'><b>Cable Information</b></td></tr>"
				
				for ( var row = 0; row < description.length; row++){
					tab+='<tr>'
					for (var col = 0; col < 2; col++){
						if(col == 0){
							tab+="<td style='background:green'>"+description[row]+"</td>"
						} else {
							tab+="<td style='background:green'>"+cable[row]+"</td>"
						}
				   }
				   tab+='</tr>'
			   }    
			   tab+='</table>';
			   lab.innerHTML=tab;
			   lab.style.display="";
			}
		});
	};
	
	///switch information
	$scope.Switch = function(name) {
		var swMsg = arrayInfo['Swinfo'];
		var lab = document.getElementById(name);
		var description = ["Pca9546", "Pca9555-1", "Pca9555-2", "Pca9555-3", "Pca9555-4", "Pca9555-5", 
			"Pca9555-6", "Pca9555-7", "Pca9555-8", "Pca9555-9", "Pca9555-10", "Pca9555-11", "SsdType",
			"CustomConfigurationFileVersion", "UsiFirmwareVersion", "VendorTableVersion"];
		
		var tab='<table border=1 align="center">'
		
		tab+="<tr><td align='center' valian='middle' colspan='2'><b>Switch Information</b></td></tr>"
		for(var row = 0; row < description.length; row++){
			tab+='<tr>'
			for(var col = 0; col < 2; col++){
				if(col == 0){
					tab+="<td style='background:green'>"+description[row]+"</td>"
				} else {
					tab+="<td style='background:green'>"+swMsg[description[row]]+"</td>"
				}
			}
			tab+='</tr>'
		}
		tab+='</table>';
		lab.innerHTML=tab;
		lab.style.display="";			
		
	};
	
	
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
