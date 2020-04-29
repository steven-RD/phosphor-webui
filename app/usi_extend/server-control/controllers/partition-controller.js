/**
    * Controller for partition
    *
    * @module app/serverHealth
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

    angular.module('app.serverHealth').controller('partitionController', [
    '$scope', '$window', 'UsiAPIUtils', 'APIUtils', 'dataService', 'toastService',
    function($scope, $window, UsiAPIUtils, APIUtils, dataService, toastService) {
		$scope.loading = false;
		
		/* var Patopoinfo = {
			"Partition(0)": {
			    "Dspid-1": "bound to ssd-1.",
			    "Dspid-2": "bound to ssd-2.",
			    "Dspid-3": "bound to ssd-3.",
			    "Dspid-4": "bound to ssd-4.",
			    "Dspid-5": "bound to ssd-5.",
			    "Dspid-6": "bound to ssd-6.",
			    "Dspid-7": "bound to ssd-7.",
			    "Dspid-8": "bound to ssd-8.",
			    "Dspid-9": "bound to ssd-9.",
			    "Dspid-10": "bound to ssd-10.",
			    "Dspid-11": "bound to ssd-11.",
			    "Dspid-12": "bound to ssd-12.",
			    "Dspid-13": "bound to ssd-13.",
			    "Dspid-14": "bound to ssd-14.",
			    "Dspid-15": "bound to ssd-15.",
			    "Dspid-16": "bound to ssd-16.",
			    "Dspid-17": "bound to ssd-17.",
			    "Dspid-18": "bound to ssd-18.",
			    "Dspid-19": "bound to ssd-19.",
			    "Dspid-20": "bound to ssd-20.",
			    "Dspid-21": "bound to ssd-21.",
			    "Dspid-22": "bound to ssd-22.",
			    "Dspid-23": "bound to ssd-23.",
			    "Dspid-24": "bound to ssd-24."
			}
		};
		var Patopoinfo = {
			"Partition(0)": {
			    "Dspid-1": "bound to ssd-1.",
			    "Dspid-2": "bound to ssd-2.",
			    "Dspid-3": "bound to ssd-3.",
			    "Dspid-4": "bound to ssd-4.",
			    "Dspid-5": "bound to ssd-5.",
			    "Dspid-6": "bound to ssd-6.",
			    "Dspid-7": "bound to ssd-7.",
			    "Dspid-8": "bound to ssd-8.",
			    "Dspid-9": "bound to ssd-9.",
			    "Dspid-10": "bound to ssd-10.",
			    "Dspid-11": "bound to ssd-11.",
			    "Dspid-12": "bound to ssd-12."
			},
			"Partition(1)": {
			    "Dspid-13": "bound to ssd-13.",
			    "Dspid-14": "bound to ssd-14.",
			    "Dspid-15": "bound to ssd-15.",
			    "Dspid-16": "bound to ssd-16.",
			    "Dspid-17": "bound to ssd-17.",
			    "Dspid-18": "bound to ssd-18.",
			    "Dspid-19": "bound to ssd-19.",
			    "Dspid-20": "bound to ssd-20.",
			    "Dspid-21": "bound to ssd-21.",
			    "Dspid-22": "bound to ssd-22.",
			    "Dspid-23": "bound to ssd-23.",
			    "Dspid-24": "bound to ssd-24."
			}
		}; */
		
		var Patopoinfo = {
			"Partition(0)": {
			    "Dspid-1": "bound to ssd-1.",
			    "Dspid-2": "bound to ssd-2.",
			    "Dspid-3": "bound to ssd-3.",
			    "Dspid-4": "bound to ssd-4.",
			    "Dspid-5": "bound to ssd-5.",
			    "Dspid-6": "bound to ssd-6."
			},
			"Partition(1)": {
			    "Dspid-7": "bound to ssd-7.",
			    "Dspid-8": "bound to ssd-8.",
			    "Dspid-9": "bound to ssd-9.",
			    "Dspid-10": "bound to ssd-10.",
			    "Dspid-11": "bound to ssd-11.",
			    "Dspid-12": "bound to ssd-12."
			},
			"Partition(2)": {
			    "Dspid-13": "bound to ssd-13.",
			    "Dspid-14": "bound to ssd-14.",
			    "Dspid-15": "bound to ssd-15.",
			    "Dspid-16": "bound to ssd-16.",
			    "Dspid-17": "bound to ssd-17.",
			    "Dspid-18": "bound to ssd-18."
			},
			"Partition(3)": {
			    "Dspid-19": "bound to ssd-19.",
			    "Dspid-20": "bound to ssd-20.",
			    "Dspid-21": "bound to ssd-21.",
			    "Dspid-22": "bound to ssd-22.",
			    "Dspid-23": "bound to ssd-23.",
			    "Dspid-24": "bound to ssd-24."
			} 
		};

		
		$scope.loadSsdInfo = function() {
			var arrayInfo=[];
			UsiAPIUtils.getSsdArrayInfo().then(
				function(data){
					arrayInfo = data;
					
					var length = Object.keys(Patopoinfo).length;
					console.log(length);
					if(length == 1){
						$scope.patopo1=true;
						$scope.patopo2=false;
						$scope.patopo4=false;
						$scope.partition_1=true;
						$scope.partition_2=false;
						$scope.partition_4=false;
						angular.forEach(Patopoinfo, function(partition, name) {
							if(angular.equals(name, "Partition(0)")) {
								$scope.partition1_0=partition;
								$scope.name1_0=name;
							}
						});
					} else if(length == 2) { 
						$scope.patopo1=false;
						$scope.patopo2=true;
						$scope.patopo4=false;
						$scope.partition_1=false;
						$scope.partition_2=true;
						$scope.partition_4=false;
						angular.forEach(Patopoinfo, function(partition, name) {
							if(angular.equals(name, "Partition(0)")) {
								$scope.partition2_0=partition;
								$scope.name2_0=name;
							}else if(angular.equals(name, "Partition(1)")){
								$scope.partition2_1=partition;
								$scope.name2_1=name;
							}
						});
					} else if(length == 4) {
						$scope.patopo1=false;
						$scope.patopo2=false;
						$scope.patopo4=true;
						$scope.partition_1=false;
						$scope.partition_2=false;
						$scope.partition_4=true;
						angular.forEach(Patopoinfo, function(partition, name) {
							console.log(partition);
							console.log(name);
							if(angular.equals(name, "Partition(0)")) {
								$scope.partition4_0=partition;
								$scope.name4_0=name;
							}else if(angular.equals(name, "Partition(1)")){
								$scope.partition4_1=partition;
								$scope.name4_1=name;
							}else if(angular.equals(name, "Partition(2)")){
								$scope.partition4_2=partition;
								$scope.name4_2=name;
							}else if(angular.equals(name, "Partition(3)")){
								$scope.partition4_3=partition;
								$scope.name4_3=name;
							}
						});
					}
				},
				function(error) {
				   toastService.error('Error during getSsdArrayInfo');
				}
			);
			
		};
		
		$scope.loadSsdInfo();
		
		/* var patArray = ['ssd1', 'ssd2', 'ssd3', 'ssd4', 'ssd5', 'ssd6', 
						'ssd7', 'ssd8', 'ssd9', 'ssd10', 'ssd11', 'ssd12'];
		var x = [61, 90, 119, 146, 175, 204, 232, 259, 286, 315, 342, 370, 
				 396, 425, 452, 480, 508, 535, 560, 589, 618, 645, 675, 703];
		$scope.loadSsdInfo = function() {
			var arrayInfo=[];
			UsiAPIUtils.getSsdArrayInfo().then(
				function(data){
					arrayInfo = data;
				},
				function(error) {
				   toastService.error('Error during getSsdArrayInfo');
				}
			);
			
			$scope.patopoinfo = arrayInfo['Patopoinfo'];
			///deal with patopoinfo to get ssdx place into order patArray
			
		};
			
		 $scope.draw = function() {
			var img = new Image();
			img.src = "../../../assets/images/J2024-03-front.png";
			console.log("45");
			var canvas = document.getElementById('canvas'); // 拿到画板
			var context = canvas.getContext('2d');          // 拿到上下文
			var pat=context.createPattern(img,"no-repeat");
			context.rect(0,0,800,400);
			context.fillStyle=pat;
			context.fill();
			console.log("52");
			context.strokeStyle = 'red'; 	  
			context.lineWidth = 1;       
			context.beginPath();         
			console.log("56");
			var ssdNum = 0;
			var num = 0, pos = 0;
			var position = [];
			var record = [];
			var firstPos = true;
			for(var i = 0; i < patArray.length; i++) { ///遍历patArray，找出patArray中' '的位置放在position[]中
				if(patArray[i] != ' '){
					ssdNum++;
					if(i == patArray.length-1){ ///最后一个ssd
						record[num++] = ssdNum;
						console.log(record);
					}
				}else{
					record[num++] = ssdNum; ///记录patArray中出现' '时的ssd的数量
					position[pos++] = i;    ///记录
					ssdNum = 0;
					console.log(record);
					console.log(position);
				}
			}
		
			for(var p = 0; p < record.length; p++) {
				if(position[0] != 0 && firstPos == true){ ///patArray第一个位置不为' '
					var width = x[record[0]] - x[0];
					context.rect(61, 130, width, 118);
					firstPos = false;
					console.log(width);
				}
				if(p != 0 && record[p] != 0) { ///
					context.rect(x[position[p-1]+1], 130, x[position[p]]-x[position[p-1]+1], 118);
				}
			}
			
			//context.strokeStyle = 'red'; 	  
			//context.lineWidth = 1;       
			//context.beginPath();         
			//context.rect(61,130,23,118);
			context.stroke();
		}
		
		$scope.loadSsdInfo(); */
    }
  ]);
})(angular);
