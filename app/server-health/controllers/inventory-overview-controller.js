/**
 * Controller for server
 *
 * @module app/serverHealth
 * @exports inventoryOverviewController
 * @name inventoryOverviewController
 */

window.angular && (function(angular) {
  'use strict';

  angular.module('app.serverHealth').controller('inventoryOverviewController', [
    '$scope', '$window', 'APIUtils', 'dataService',
    function($scope, $window, APIUtils, dataService) {
      $scope.dataService = dataService;
      $scope.hardwares = [];
      $scope.originalData = {};
      $scope.customSearch = '';
      $scope.searchTerms = [];
      $scope.loading = true;

      APIUtils.getHardwares(function(data, originalData) {
		  var i = 0, j = 0;
		  var harddata = [];
		for(i = 0; i < data.length; i++){
			if(data[i].title != 'system' && data[i].title != 'chassis'){
				$scope.harddata[j] = data[i];
				j++;
			}
		}
        $scope.hardwares = harddata;
		console.log(harddata);
		console.log($scope.hardwares);
        $scope.originalData = JSON.stringify(originalData);
        $scope.loading = false;
      });

      $scope.clear = function() {
        $scope.customSearch = '';
        $scope.searchTerms = [];
      };

      $scope.doSearchOnEnter = function(event) {
        var search =
            $scope.customSearch.replace(/^\s+/g, '').replace(/\s+$/g, '');
        if (event.keyCode === 13 && search.length >= 2) {
          $scope.searchTerms = $scope.customSearch.split(' ');
        } else {
          if (search.length == 0) {
            $scope.searchTerms = [];
          }
        }
      };

      $scope.doSearchOnClick = function() {
        var search =
            $scope.customSearch.replace(/^\s+/g, '').replace(/\s+$/g, '');
        if (search.length >= 2) {
          $scope.searchTerms = $scope.customSearch.split(' ');
        } else {
          if (search.length == 0) {
            $scope.searchTerms = [];
          }
        }
      };

      $scope.filterBySearchTerms = function(hardware) {
        if (!$scope.searchTerms.length) return true;

        for (var i = 0, length = $scope.searchTerms.length; i < length; i++) {
          if (hardware.search_text.indexOf(
                  $scope.searchTerms[i].toLowerCase()) == -1)
            return false;
        }
        return true;
      };
    }
  ]);
})(angular);
