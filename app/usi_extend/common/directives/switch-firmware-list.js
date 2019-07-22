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

            $scope.update = function(Name, Version, Type) {
                $scope.$parent.updateImage(Name, Version, Type);
                $scope.activateFlag = false;
            };

            $scope.run = function(Name, Version, Type) {
                $scope.$parent.runImage(Name, Version, Type);
            };

            $scope.delete = function(Name, Version) {
              $scope.$parent.deleteImage(Name, Version);
            };
          }
        ]
      };
    }
  ]);
})(window.angular);
