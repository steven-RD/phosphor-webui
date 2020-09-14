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
		};
		 */
		/* var Patopoinfo = {
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
		}; */

		
		$scope.loadParInfo = function() {
			var Patopoinfo=[];
			UsiAPIUtils.getParInfo().then(
				function(data){
					//Patopoinfo = data;
					console.log(data);
					if(JSON.stringify(data["iocca"]) != {}"") {
						Patopoinfo = data["iocca"];
						console.log("iocca");
						console.log(Patopoinfo);
					}else{
						Patopoinfo = data["ioccb"];
						console.log("ioccb");
						console.log(Patopoinfo);
					}
					
					var length = Object.keys(Patopoinfo).length;
					console.log(length);
					if(length == 2){
						$scope.patopo1=true;
						$scope.patopo2=false;
						$scope.patopo4=false;
						$scope.partition_1=true;
						$scope.partition_2=false;
						$scope.partition_4=false;
						angular.forEach(Patopoinfo, function(partition, name) {
							console.log(partition);
							console.log(name);
							if(angular.equals(name, "Partition(0)")) {
								$scope.partition1_0=partition;
								$scope.name1_0=name;
							}
						});
					} else if(length == 3) { 
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
					} else if(length == 5) {
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
		
		$scope.loadParInfo();
		

    }
  ]);
})(angular);
