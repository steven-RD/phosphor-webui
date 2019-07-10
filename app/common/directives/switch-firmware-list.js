/**
 * switchFirmwareList
 *
 * Judy add 20190710 according to firmware-list.js
 */

window.angular && (function(angular) {
  'use strict';

  angular.module('app.common.directives').directive('switchFirmwareList', [
    'APIUtils',
    function(APIUtils) {
      return {
        'restrict': 'E',
        'template': require('./switch-firmware-list.html'),
        'scope':
            {'title': '@', 'firmwares': '=', 'filterBy': '=', 'version': '='},
        'controller': ['$scope', 'dataService', function($scope, dataService) {
            $scope.dataService = dataService;
            $scope.activateFlag = true;

            $scope.update = function(imageId, imageVersion, imageType) {
                $scope.$parent.updateImage(imageId, imageVersion, imageType);
                $scope.activateFlag = false;
            };

            $scope.run = function(imageId, imageVersion, imageType) {
                $scope.$parent.runImage(imageId, imageVersion, imageType);
            };

            $scope.delete = function(imageId, imageVersion) {
              $scope.$parent.deleteSwitchImage(imageId, imageVersion);
            };
          }
        ]
      };
    }
  ]);
})(window.angular);
