/**
    * Controller for ssdarray
    *
    * @module app/serverControl
    * @exports powerUsageController
    * @name ssdArrayController
    *
    *
    * @author Steven & Judy
    * @date   20200417
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
          $scope.bmcFlag = false;
          $scope.ipFlag = false;
          $scope.ioccxFlag = false;
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
          }else if(flag == 'bmc'){ 
              $scope.bmcFlag = true;
          }else if(flag == 'ip'){
              $scope.ipFlag = true;
          }else if(flag == 'ioccx'){
              $scope.ioccxFlag = true;
          }
      };

      $scope.leave = function(id){
          $scope.ssdFlag = false;
          $scope.cableFlag = false;
          $scope.switchFlag = false;
          $scope.psFlag = false;
          $scope.psxFlag = false;
          $scope.fanFlag = false;
          $scope.bmcFlag = false;
          $scope.ipFlag = false;
          $scope.ioccxFlag = false;
          var lab = document.getElementById(id);
          lab.style.display = "none";
      };

      var ssdMessage=[];
      var cableMessage=[];
      var swMessage=[];
      var BMCMessage=[];
      var PSInfo=[];
      ///ssd information
      $scope.SSD = function(num){
      angular.forEach(ssdMessage, function(ssdInfo, ssdNum){
        if(angular.equals(ssdNum, num)){
            $scope.ssdNo=ssdNum;
            $scope.ssdx=ssdInfo;
            changeStatus('ssd');
			var n = num.replace(/[^0-9]/ig,"");
			//console.log(n);
            var lab = document.getElementById('usi-ssd');
            var mousePosition = getMousePos(window.event); ///Get mouse position
            lab.style.position = "absolute";
            lab.style.display = "block";
            //lab.style.left = mousePosition.x + 5 + 'px';
			if(n > 12){
				lab.style.left = mousePosition.x - 300 + 'px';
			} else {
				lab.style.left = mousePosition.x + 5 + 'px';
			}
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
            //$scope.psinfo=PSInfo;
			 angular.forEach(PSInfo, function(psInfo, psName) {
                if(angular.equals(psName, 'PS1')) {
					if(psInfo.Status != 'OK')
                        psInfo.Status = 'Error';
                    $scope.ps1name=psName;
                    $scope.ps1info=psInfo;
                } else if (angular.equals(psName, 'PS2')) {
					if(psInfo.Status != 'OK')
                        psInfo.Status = 'Error';
                    $scope.ps2name=psName;
                    $scope.ps2info=psInfo;
				}
            });
            var lab = document.getElementById('usi-ps');
            var mousePosition = getMousePos(window.event); ///Get mouse position
            lab.style.position = "absolute";
            lab.style.display = "block";
            lab.style.left = mousePosition.x + 5 + 'px';
            lab.style.top = mousePosition.y + 5 + 'px';
            lab.style.height = '0px';
            lab.style.width = '0px';
        }else{
            angular.forEach(PSInfo, function(psInfo, psName) {
                if(angular.equals(psName, name)) {
                    changeStatus('psx');
					if(psInfo.Status != 'OK')
						psInfo.Status = 'Error';
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
    $scope.Cable = function(name) {
        if(cableMessage[name] != "Cableinfo Get Fail"){
            changeStatus('cable');
            $scope.cableinfo = cableMessage[name];
            var lab = document.getElementById('usi-cable');
            var mousePosition = getMousePos(window.event); ///Get mouse position
            lab.style.position = "absolute";
            lab.style.display = "block";
            lab.style.left = mousePosition.x + 5 + 'px';
            lab.style.top = mousePosition.y + 5 + 'px';
            lab.style.height = '0px';
            lab.style.width = '0px';
        }else{
            changeStatus('ioccx');
            $scope.ioccname = name;
            $scope.ioccxstatus = cableMessage[name];
            var lab = document.getElementById('usi-ioccx');
            var mousePosition = getMousePos(window.event); ///Get mouse position
            lab.style.position = "absolute";
            lab.style.display = "block";
            lab.style.left = mousePosition.x + 5 + 'px';
            lab.style.top = mousePosition.y + 5 + 'px';
            lab.style.height = '0px';
            lab.style.width = '0px';
        }
    };

    ///switch information
    $scope.Switch = function(name) {
        if(swMessage[name] != "Switchinfo Get Fail"){
            changeStatus('sw');
            $scope.swinfo = swMessage[name];
            var lab = document.getElementById('usi-switch');
            var mousePosition = getMousePos(window.event); ///Get mouse position
            lab.style.position = "absolute";
            lab.style.display = "block";
            lab.style.height = '0px';
            lab.style.width = '0px';
            lab.style.left = mousePosition.x + 5 + 'px';
            lab.style.top = mousePosition.y + 5 + 'px';
        }else {
            changeStatus('ioccx');
            $scope.ioccname = name;
            $scope.ioccxstatus = swMessage[name];
            var lab = document.getElementById('usi-ioccx');
            var mousePosition = getMousePos(window.event); ///Get mouse position
            lab.style.position = "absolute";
            lab.style.display = "block";
            lab.style.left = mousePosition.x + 5 + 'px';
            lab.style.top = mousePosition.y + 5 + 'px';
            lab.style.height = '0px';
            lab.style.width = '0px';
        }
    };

    var whichiocc = 'None';
    ///BMC information
    $scope.BMC = function(name) {
        if(BMCMessage.hasOwnProperty(name)){
            whichiocc = name;
			console.log(whichiocc);
            if(BMCMessage[name] != "Bmcinfo Get Fail"){
                changeStatus('bmc');
                $scope.bmcinfo = 'None';
                $scope.bmcinfo = BMCMessage[name];
                //console.log($scope.bmcinfo);
                var lab = document.getElementById('usi-bmc');
                var mousePosition = getMousePos(window.event); ///Get mouse position
                lab.style.position = "absolute";
                lab.style.display = "block";
                lab.style.height = '0px';
                lab.style.width = '0px';
                lab.style.left = mousePosition.x + 5 + 'px';
                lab.style.top = mousePosition.y + 5 + 'px';
            }else{
                changeStatus('ioccx');
                $scope.ioccname = name;
                $scope.ioccxstatus = BMCMessage[name];
                //console.log($scope.ioccname);
                //console.log($scope.ioccxstatus);
                var lab = document.getElementById('usi-ioccx');
                var mousePosition = getMousePos(window.event); ///Get mouse position
                lab.style.position = "absolute";
                lab.style.display = "block";
                lab.style.left = mousePosition.x + 5 + 'px';
                lab.style.top = mousePosition.y + 5 + 'px';
                lab.style.height = '0px';
                lab.style.width = '0px';
            }
        }
    };

    ///IP information
    $scope.Ip = function(name) {
        if (name != whichiocc) {
			console.log(whichiocc);
            changeStatus('ip');
			$scope.bmc_ip = dataService.server_id;
			console.log(dataService.server_id);
            var lab = document.getElementById('usi-ip');
            var mousePosition = getMousePos(window.event); ///Get mouse position
            lab.style.position = "absolute";
            lab.style.display = "block";
            lab.style.height = '0px';
            lab.style.width = '0px';
            lab.style.left = mousePosition.x + 5 + 'px';
            lab.style.top = mousePosition.y + 5 + 'px';
        }
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
        $scope.faninfoIN = 'None';
        for(var i = 0; i < fanData.length; i++){
            if(fanData[i].title.indexOf(name+' INLET') != -1) {
                $scope.fanInTitle = name+'_INLET';
                $scope.faninfoIN = fanData[i];
            }else if(fanData[i].title.indexOf(name+' OUTLET') != -1){
                $scope.fanOutTitle = name+'_OUTLET';
                $scope.faninfoOUT = fanData[i];
            }
        }
    };

      ///arrow loop
      var index = 0;
      $scope.moveNext = function(arrow){
          $scope.ssdFlag = false;
          $scope.cableFlag = false;
          $scope.switchFlag = false;
          $scope.psFlag = false;
          $scope.psxFlag = false;
          $scope.fanFlag = false;
          $scope.bmcFlag = false;
          $scope.ipFlag = false;
          $scope.ioccxFlag = false;
          var imgElement = document.getElementById("imgs").getElementsByTagName("li");
          var imgLen = imgElement.length;
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
          var x = event.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
          var y = event.clientY+ document.body.scrollTop + document.documentElement.scrollTop;
          return { 'x': x, 'y': y };
      }

      $scope.loadSsdInfo = function(){
        UsiAPIUtils.getSsdInfo().then(
            function(data){
                //ssdMessage = data;
			ssdMessage = {
				"SSD1": {
					"ConfigureWidth": "x4",
					"Inserted": "Absent",
					"LinkSpeed": "Not link",
					"LinkStatus": "Fail",
					"LinkWidth": "Not link",
					"PartitionID": "1",
					"SlotAddr": "1",
					"Status": "Good",
					"Type": "U.2",
					"Value": "0x4300109"
				  },
				"SSD2": {
					"ConfigureWidth": "x4",
					"Inserted": "Absent",
					"LinkSpeed": "Not link",
					"LinkStatus": "Fail",
					"LinkWidth": "Not link",
					"PartitionID": "0",
					"SlotAddr": "2",
					"Status": "Bad",
					"Type": "U.2",
					"Value": "0x300111"
				  },
				"SSD3": {
					"ConfigureWidth": "x4",
					"Inserted": "Absent",
					"LinkSpeed": "Not link",
					"LinkStatus": "Fail",
					"LinkWidth": "Not link",
					"PartitionID": "0",
					"SlotAddr": "3",
					"Status": "Absent",
					"Type": "U.2",
					"Value": "0x300119"
				  },
				"SSD4": {
					"ConfigureWidth": "x4",
					"Inserted": "Absent",
					"LinkSpeed": "Not link",
					"LinkStatus": "Fail",
					"LinkWidth": "Not link",
					"PartitionID": "1",
					"SlotAddr": "4",
					"Status": "Absent",
					"Type": "U.2",
					"Value": "0x4300121"
				  },
				"SSD5": {
					"ConfigureWidth": "x4",
					"Inserted": "Absent",
					"LinkSpeed": "Not link",
					"LinkStatus": "Fail",
					"LinkWidth": "Not link",
					"PartitionID": "1",
					"SlotAddr": "5",
					"Status": "Good",
					"Type": "U.2",
					"Value": "0x4300109"
				  },
				"SSD6": {
					"ConfigureWidth": "x4",
					"Inserted": "Absent",
					"LinkSpeed": "Not link",
					"LinkStatus": "Fail",
					"LinkWidth": "Not link",
					"PartitionID": "0",
					"SlotAddr": "6",
					"Status": "Bad",
					"Type": "U.2",
					"Value": "0x300111"
				  },
				"SSD7": {
					"ConfigureWidth": "x4",
					"Inserted": "Absent",
					"LinkSpeed": "Not link",
					"LinkStatus": "Fail",
					"LinkWidth": "Not link",
					"PartitionID": "0",
					"SlotAddr": "7",
					"Status": "Absent",
					"Type": "U.2",
					"Value": "0x300119"
				  },
				"SSD8": {
					"ConfigureWidth": "x4",
					"Inserted": "Absent",
					"LinkSpeed": "Not link",
					"LinkStatus": "Fail",
					"LinkWidth": "Not link",
					"PartitionID": "1",
					"SlotAddr": "8",
					"Status": "Absent",
					"Type": "U.2",
					"Value": "0x4300121"
				  },
				"SSD9": {
					"ConfigureWidth": "x4",
					"Inserted": "Absent",
					"LinkSpeed": "Not link",
					"LinkStatus": "Fail",
					"LinkWidth": "Not link",
					"PartitionID": "1",
					"SlotAddr": "9",
					"Status": "Good",
					"Type": "U.2",
					"Value": "0x4300109"
				  },
				"SSD10": {
					"ConfigureWidth": "x4",
					"Inserted": "Absent",
					"LinkSpeed": "Not link",
					"LinkStatus": "Fail",
					"LinkWidth": "Not link",
					"PartitionID": "0",
					"SlotAddr": "10",
					"Status": "Bad",
					"Type": "U.2",
					"Value": "0x300111"
				  },
				"SSD11": {
					"ConfigureWidth": "x4",
					"Inserted": "Absent",
					"LinkSpeed": "Not link",
					"LinkStatus": "Fail",
					"LinkWidth": "Not link",
					"PartitionID": "0",
					"SlotAddr": "11",
					"Status": "Absent",
					"Type": "U.2",
					"Value": "0x300119"
				  },
				"SSD12": {
					"ConfigureWidth": "x4",
					"Inserted": "Absent",
					"LinkSpeed": "Not link",
					"LinkStatus": "Fail",
					"LinkWidth": "Not link",
					"PartitionID": "1",
					"SlotAddr": "12",
					"Status": "Absent",
					"Type": "U.2",
					"Value": "0x4300121"
				  },
				"SSD13": {
					"ConfigureWidth": "x4",
					"Inserted": "Absent",
					"LinkSpeed": "Not link",
					"LinkStatus": "Fail",
					"LinkWidth": "Not link",
					"PartitionID": "1",
					"SlotAddr": "13",
					"Status": "Good",
					"Type": "U.2",
					"Value": "0x4300109"
				  },
				"SSD14": {
					"ConfigureWidth": "x4",
					"Inserted": "Absent",
					"LinkSpeed": "Not link",
					"LinkStatus": "Fail",
					"LinkWidth": "Not link",
					"PartitionID": "0",
					"SlotAddr": "14",
					"Status": "Bad",
					"Type": "U.2",
					"Value": "0x300111"
				  },
				"SSD15": {
					"ConfigureWidth": "x4",
					"Inserted": "Absent",
					"LinkSpeed": "Not link",
					"LinkStatus": "Fail",
					"LinkWidth": "Not link",
					"PartitionID": "0",
					"SlotAddr": "15",
					"Status": "Absent",
					"Type": "U.2",
					"Value": "0x300119"
				  },
				"SSD16": {
					"ConfigureWidth": "x4",
					"Inserted": "Absent",
					"LinkSpeed": "Not link",
					"LinkStatus": "Fail",
					"LinkWidth": "Not link",
					"PartitionID": "1",
					"SlotAddr": "16",
					"Status": "Absent",
					"Type": "U.2",
					"Value": "0x4300121"
				  },
				"SSD17": {
					"ConfigureWidth": "x4",
					"Inserted": "Absent",
					"LinkSpeed": "Not link",
					"LinkStatus": "Fail",
					"LinkWidth": "Not link",
					"PartitionID": "1",
					"SlotAddr": "17",
					"Status": "Good",
					"Type": "U.2",
					"Value": "0x4300109"
				  },
				"SSD18": {
					"ConfigureWidth": "x4",
					"Inserted": "Absent",
					"LinkSpeed": "Not link",
					"LinkStatus": "Fail",
					"LinkWidth": "Not link",
					"PartitionID": "0",
					"SlotAddr": "18",
					"Status": "Bad",
					"Type": "U.2",
					"Value": "0x300111"
				  },
				"SSD19": {
					"ConfigureWidth": "x4",
					"Inserted": "Absent",
					"LinkSpeed": "Not link",
					"LinkStatus": "Fail",
					"LinkWidth": "Not link",
					"PartitionID": "0",
					"SlotAddr": "19",
					"Status": "Absent",
					"Type": "U.2",
					"Value": "0x300119"
				  },
				"SSD20": {
					"ConfigureWidth": "x4",
					"Inserted": "Absent",
					"LinkSpeed": "Not link",
					"LinkStatus": "Fail",
					"LinkWidth": "Not link",
					"PartitionID": "1",
					"SlotAddr": "20",
					"Status": "Absent",
					"Type": "U.2",
					"Value": "0x4300121"
				  },
				"SSD21": {
					"ConfigureWidth": "x4",
					"Inserted": "Absent",
					"LinkSpeed": "Not link",
					"LinkStatus": "Fail",
					"LinkWidth": "Not link",
					"PartitionID": "1",
					"SlotAddr": "21",
					"Status": "Good",
					"Type": "U.2",
					"Value": "0x4300109"
				  },
				"SSD22": {
					"ConfigureWidth": "x4",
					"Inserted": "Absent",
					"LinkSpeed": "Not link",
					"LinkStatus": "Fail",
					"LinkWidth": "Not link",
					"PartitionID": "0",
					"SlotAddr": "22",
					"Status": "Bad",
					"Type": "U.2",
					"Value": "0x300111"
				  },
				"SSD23": {
					"ConfigureWidth": "x4",
					"Inserted": "Absent",
					"LinkSpeed": "Not link",
					"LinkStatus": "Fail",
					"LinkWidth": "Not link",
					"PartitionID": "0",
					"SlotAddr": "23",
					"Status": "Absent",
					"Type": "U.2",
					"Value": "0x300119"
				  },
				"SSD24": {
					"ConfigureWidth": "x4",
					"Inserted": "Absent",
					"LinkSpeed": "Not link",
					"LinkStatus": "Fail",
					"LinkWidth": "Not link",
					"PartitionID": "1",
					"SlotAddr": "24",
					"Status": "Absent",
					"Type": "U.2",
					"Value": "0x4300121"
				  }
			};
			
				angular.forEach(ssdMessage, function(ssdInfo, ssdNum){
					if(angular.equals(ssdNum, "SSD1")){
						if(ssdInfo.Status == "Good"){
							$scope.ssd1good = true;
							$scope.ssd1bad = false;
							$scope.ssd1warning =false;
						}else if (ssdInfo.Status == "Bad"){
							$scope.ssd1good = false;
							$scope.ssd1bad = true;
							$scope.ssd1warning =false;
						}else if (ssdInfo.Status == "Absent"){
							$scope.ssd1good = false;
							$scope.ssd1bad = false;
							$scope.ssd1warning =true;
						}
					}
					if(angular.equals(ssdNum, "SSD2")){
						if(ssdInfo.Status == "Good"){
							$scope.ssd2good = true;
							$scope.ssd2bad = false;
							$scope.ssd2warning =false;
						}else if (ssdInfo.Status == "Bad"){
							$scope.ssd2good = false;
							$scope.ssd2bad = true;
							$scope.ssd2warning =false;
						}else if (ssdInfo.Status == "Absent"){
							$scope.ssd2good = false;
							$scope.ssd2bad = false;
							$scope.ssd2warning =true;
						}
					}
					if(angular.equals(ssdNum, "SSD3")){
						if(ssdInfo.Status == "Good"){
							$scope.ssd3good = true;
							$scope.ssd3bad = false;
							$scope.ssd3warning =false;
						}else if (ssdInfo.Status == "Bad"){
							$scope.ssd3good = false;
							$scope.ssd3bad = true;
							$scope.ssd3warning =false;
						}else if (ssdInfo.Status == "Absent"){
							$scope.ssd3good = false;
							$scope.ssd3bad = false;
							$scope.ssd3warning =true;
						}
					}
					if(angular.equals(ssdNum, "SSD4")){
						if(ssdInfo.Status == "Good"){
							$scope.ssd4good = true;
							$scope.ssd4bad = false;
							$scope.ssd4warning =false;
						}else if (ssdInfo.Status == "Bad"){
							$scope.ssd4good = false;
							$scope.ssd4bad = true;
							$scope.ssd4warning =false;
						}else if (ssdInfo.Status == "Absent"){
							$scope.ssd4good = false;
							$scope.ssd4bad = false;
							$scope.ssd4warning =true;
						}
					}
					if(angular.equals(ssdNum, "SSD5")){
						if(ssdInfo.Status == "Good"){
							$scope.ssd5good = true;
							$scope.ssd5bad = false;
							$scope.ssd5warning =false;
						}else if (ssdInfo.Status == "Bad"){
							$scope.ssd5good = false;
							$scope.ssd5bad = true;
							$scope.ssd5warning =false;
						}else if (ssdInfo.Status == "Absent"){
							$scope.ssd5good = false;
							$scope.ssd5bad = false;
							$scope.ssd5warning =true;
						}
					}
					if(angular.equals(ssdNum, "SSD6")){
						if(ssdInfo.Status == "Good"){
							$scope.ssd6good = true;
							$scope.ssd6bad = false;
							$scope.ssd6warning =false;
						}else if (ssdInfo.Status == "Bad"){
							$scope.ssd6good = false;
							$scope.ssd6bad = true;
							$scope.ssd6warning =false;
						}else if (ssdInfo.Status == "Absent"){
							$scope.ssd6good = false;
							$scope.ssd6bad = false;
							$scope.ssd6warning =true;
						}
					}
					if(angular.equals(ssdNum, "SSD7")){
						if(ssdInfo.Status == "Good"){
							$scope.ssd7good = true;
							$scope.ssd7bad = false;
							$scope.ssd7warning =false;
						}else if (ssdInfo.Status == "Bad"){
							$scope.ssd7good = false;
							$scope.ssd7bad = true;
							$scope.ssd7warning =false;
						}else if (ssdInfo.Status == "Absent"){
							$scope.ssd7good = false;
							$scope.ssd7bad = false;
							$scope.ssd7warning =true;
						}
					}
					if(angular.equals(ssdNum, "SSD8")){
						if(ssdInfo.Status == "Good"){
							$scope.ssd8good = true;
							$scope.ssd8bad = false;
							$scope.ssd8warning =false;
						}else if (ssdInfo.Status == "Bad"){
							$scope.ssd8good = false;
							$scope.ssd8bad = true;
							$scope.ssd8warning =false;
						}else if (ssdInfo.Status == "Absent"){
							$scope.ssd8good = false;
							$scope.ssd8bad = false;
							$scope.ssd8warning =true;
						}
					}
					if(angular.equals(ssdNum, "SSD9")){
						if(ssdInfo.Status == "Good"){
							$scope.ssd9good = true;
							$scope.ssd9bad = false;
							$scope.ssd9warning =false;
						}else if (ssdInfo.Status == "Bad"){
							$scope.ssd9good = false;
							$scope.ssd9bad = true;
							$scope.ssd9warning =false;
						}else if (ssdInfo.Status == "Absent"){
							$scope.ssd9good = false;
							$scope.ssd9bad = false;
							$scope.ssd9warning =true;
						}
					}
					if(angular.equals(ssdNum, "SSD10")){
						if(ssdInfo.Status == "Good"){
							$scope.ssd10good = true;
							$scope.ssd10bad = false;
							$scope.ssd10warning =false;
						}else if (ssdInfo.Status == "Bad"){
							$scope.ssd10good = false;
							$scope.ssd10bad = true;
							$scope.ssd10warning =false;
						}else if (ssdInfo.Status == "Absent"){
							$scope.ssd10good = false;
							$scope.ssd10bad = false;
							$scope.ssd10warning =true;
						}
					}
					if(angular.equals(ssdNum, "SSD11")){
						if(ssdInfo.Status == "Good"){
							$scope.ssd11good = true;
							$scope.ssd11bad = false;
							$scope.ssd11warning =false;
						}else if (ssdInfo.Status == "Bad"){
							$scope.ssd11good = false;
							$scope.ssd11bad = true;
							$scope.ssd11warning =false;
						}else if (ssdInfo.Status == "Absent"){
							$scope.ssd11good = false;
							$scope.ssd11bad = false;
							$scope.ssd11warning =true;
						}
					}
					if(angular.equals(ssdNum, "SSD12")){
						if(ssdInfo.Status == "Good"){
							$scope.ssd12good = true;
							$scope.ssd12bad = false;
							$scope.ssd12warning =false;
						}else if (ssdInfo.Status == "Bad"){
							$scope.ssd12good = false;
							$scope.ssd12bad = true;
							$scope.ssd12warning =false;
						}else if (ssdInfo.Status == "Absent"){
							$scope.ssd12good = false;
							$scope.ssd12bad = false;
							$scope.ssd12warning =true;
						}
					}
					if(angular.equals(ssdNum, "SSD13")){
						if(ssdInfo.Status == "Good"){
							$scope.ssd13good = true;
							$scope.ssd13bad = false;
							$scope.ssd13warning =false;
						}else if (ssdInfo.Status == "Bad"){
							$scope.ssd13good = false;
							$scope.ssd13bad = true;
							$scope.ssd13warning =false;
						}else if (ssdInfo.Status == "Absent"){
							$scope.ssd13good = false;
							$scope.ssd13bad = false;
							$scope.ssd13warning =true;
						}
					}
					if(angular.equals(ssdNum, "SSD14")){
						if(ssdInfo.Status == "Good"){
							$scope.ssd14good = true;
							$scope.ssd14bad = false;
							$scope.ssd14warning =false;
						}else if (ssdInfo.Status == "Bad"){
							$scope.ssd14good = false;
							$scope.ssd14bad = true;
							$scope.ssd14warning =false;
						}else if (ssdInfo.Status == "Absent"){
							$scope.ssd14good = false;
							$scope.ssd14bad = false;
							$scope.ssd14warning =true;
						}
					}
					if(angular.equals(ssdNum, "SSD15")){
						if(ssdInfo.Status == "Good"){
							$scope.ssd15good = true;
							$scope.ssd15bad = false;
							$scope.ssd15warning =false;
						}else if (ssdInfo.Status == "Bad"){
							$scope.ssd15good = false;
							$scope.ssd15bad = true;
							$scope.ssd15warning =false;
						}else if (ssdInfo.Status == "Absent"){
							$scope.ssd15good = false;
							$scope.ssd15bad = false;
							$scope.ssd15warning =true;
						}
					}
					if(angular.equals(ssdNum, "SSD16")){
						if(ssdInfo.Status == "Good"){
							$scope.ssd16good = true;
							$scope.ssd16bad = false;
							$scope.ssd16warning =false;
						}else if (ssdInfo.Status == "Bad"){
							$scope.ssd16good = false;
							$scope.ssd16bad = true;
							$scope.ssd16warning =false;
						}else if (ssdInfo.Status == "Absent"){
							$scope.ssd16good = false;
							$scope.ssd16bad = false;
							$scope.ssd16warning =true;
						}
					}
					if(angular.equals(ssdNum, "SSD17")){
						if(ssdInfo.Status == "Good"){
							$scope.ssd17good = true;
							$scope.ssd17bad = false;
							$scope.ssd17warning =false;
						}else if (ssdInfo.Status == "Bad"){
							$scope.ssd17good = false;
							$scope.ssd17bad = true;
							$scope.ssd17warning =false;
						}else if (ssdInfo.Status == "Absent"){
							$scope.ssd17good = false;
							$scope.ssd17bad = false;
							$scope.ssd17warning =true;
						}
					}
					if(angular.equals(ssdNum, "SSD18")){
						if(ssdInfo.Status == "Good"){
							$scope.ssd18good = true;
							$scope.ssd18bad = false;
							$scope.ssd18warning =false;
						}else if (ssdInfo.Status == "Bad"){
							$scope.ssd18good = false;
							$scope.ssd18bad = true;
							$scope.ssd18warning =false;
						}else if (ssdInfo.Status == "Absent"){
							$scope.ssd18good = false;
							$scope.ssd18bad = false;
							$scope.ssd18warning =true;
						}
					}
					if(angular.equals(ssdNum, "SSD19")){
						if(ssdInfo.Status == "Good"){
							$scope.ssd19good = true;
							$scope.ssd19bad = false;
							$scope.ssd19warning =false;
						}else if (ssdInfo.Status == "Bad"){
							$scope.ssd19good = false;
							$scope.ssd19bad = true;
							$scope.ssd19warning =false;
						}else if (ssdInfo.Status == "Absent"){
							$scope.ssd19good = false;
							$scope.ssd19bad = false;
							$scope.ssd19warning =true;
						}
					}
					if(angular.equals(ssdNum, "SSD20")){
						if(ssdInfo.Status == "Good"){
							$scope.ssd20good = true;
							$scope.ssd20bad = false;
							$scope.ssd20warning =false;
						}else if (ssdInfo.Status == "Bad"){
							$scope.ssd20good = false;
							$scope.ssd20bad = true;
							$scope.ssd20warning =false;
						}else if (ssdInfo.Status == "Absent"){
							$scope.ssd20good = false;
							$scope.ssd20bad = false;
							$scope.ssd20warning =true;
						}
					}
					if(angular.equals(ssdNum, "SSD21")){
						if(ssdInfo.Status == "Good"){
							$scope.ssd21good = true;
							$scope.ssd21bad = false;
							$scope.ssd21warning =false;
						}else if (ssdInfo.Status == "Bad"){
							$scope.ssd21good = false;
							$scope.ssd21bad = true;
							$scope.ssd21warning =false;
						}else if (ssdInfo.Status == "Absent"){
							$scope.ssd21good = false;
							$scope.ssd21bad = false;
							$scope.ssd21warning =true;
						}
					}
					if(angular.equals(ssdNum, "SSD22")){
						if(ssdInfo.Status == "Good"){
							$scope.ssd22good = true;
							$scope.ssd22bad = false;
							$scope.ssd22warning =false;
						}else if (ssdInfo.Status == "Bad"){
							$scope.ssd22good = false;
							$scope.ssd22bad = true;
							$scope.ssd22warning =false;
						}else if (ssdInfo.Status == "Absent"){
							$scope.ssd22good = false;
							$scope.ssd22bad = false;
							$scope.ssd22warning =true;
						}
					}
					if(angular.equals(ssdNum, "SSD23")){
						if(ssdInfo.Status == "Good"){
							$scope.ssd23good = true;
							$scope.ssd23bad = false;
							$scope.ssd23warning =false;
						}else if (ssdInfo.Status == "Bad"){
							$scope.ssd23good = false;
							$scope.ssd23bad = true;
							$scope.ssd23warning =false;
						}else if (ssdInfo.Status == "Absent"){
							$scope.ssd23good = false;
							$scope.ssd23bad = false;
							$scope.ssd23warning =true;
						}
					}
					if(angular.equals(ssdNum, "SSD24")){
						if(ssdInfo.Status == "Good"){
							$scope.ssd24good = true;
							$scope.ssd24bad = false;
							$scope.ssd24warning =false;
						}else if (ssdInfo.Status == "Bad"){
							$scope.ssd24good = false;
							$scope.ssd24bad = true;
							$scope.ssd24warning =false;
						}else if (ssdInfo.Status == "Absent"){
							$scope.ssd24good = false;
							$scope.ssd24bad = false;
							$scope.ssd24warning =true;
						}
					}

			  });
            },
            function(error) {
               toastService.error('Error during getSsdInfo');
            }
        );
      };

      $scope.loadCableInfo = function(){
        UsiAPIUtils.getCableInfo().then(
            function(data){
                cableMessage = data;
            },
            function(error) {
               toastService.error('Error during getCableInfo');
            }
        );
      };

      $scope.loadSWInfo = function(){
        UsiAPIUtils.getSWInfo().then(
            function(data){
                swMessage = data;
            },
            function(error) {
               toastService.error('Error during getSWInfo');
            }
        );
      };

      $scope.loadBMCInfo = function(){
        UsiAPIUtils.getBMCInfo().then(
            function(data){
                BMCMessage = data;
            },
            function(error) {
               toastService.error('Error during getBMCInfo');
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
      $scope.loadCableInfo();
      $scope.loadSWInfo();
      $scope.loadBMCInfo();
      $scope.loadPowerSupplyInfo();
      $scope.loadFanSensorData();
      $scope.loadNetworkInfo ();
    }
  ]);
})(angular);
