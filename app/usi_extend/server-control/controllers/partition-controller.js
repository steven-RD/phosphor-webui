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
		
		//$scope.partitionName = "../../../assets/images/partition-24.png";
		$scope.patopo24=true;
		$scope.patopo12=false;
		$scope.patopo6=false;
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
			
			//$scope.patopoinfo = arrayInfo['Patopoinfo'];
			angular.forEach(arrayInfo['Patopoinfo'], function(patopoInfo, patopoName) {
				console.log(patopoInfo);
				console.log(patopoName);
				if(angular.equals(patopoName, "Partition(0)")) {
					//$scope.patopo24=false;
					//$scope.patopo12=true;
					//$scope.patopo6=false;
				}
			}
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
