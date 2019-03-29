window.angular && (function(angular) {
  'use strict';

  angular.module('app.common.directives').directive('firmwareList', [
    'APIUtils',
    function(APIUtils) {
      return {
        'restrict': 'E',
        'template': require('./firmware-list.html'),
        'scope':
            {'title': '@', 'firmwares': '=', 'filterBy': '=', 'version': '='},
        'controller': [
          '$rootScope', '$scope', 'dataService', '$location', '$timeout',
          function($rootScope, $scope, dataService, $location, $timeout) {
            $scope.dataService = dataService;
			$scope.activateFlag = true;

            $scope.activate = function(imageId, imageVersion, imageType) {
              $scope.$parent.activateImage(imageId, imageVersion, imageType);
            };

            $scope.delete = function(imageId, imageVersion) {
              $scope.$parent.deleteImage(imageId, imageVersion);
            };

            $scope.changePriority = function(imageId, imageVersion, from, to) {
              $scope.$parent.changePriority(imageId, imageVersion, from, to);
            };

            $scope.toggleMoreDropdown = function(event, firmware) {
              firmware.extended.show = !firmware.extended.show;
              event.stopPropagation();
            };

			/*  Modified by USISH Steven 20190117 start */
			$scope.update = function(imageId, imageVersion, imageType) {
				$scope.$parent.updateImage(imageId, imageVersion, imageType);
				$scope.activateFlag = false;
			};

			$scope.run = function(imageId, imageVersion, imageType) {
				$scope.$parent.runImage(imageId, imageVersion, imageType);
			};
			/*  Modified by USISH Steven 20190117 start */

          }
        ]
      };
    }
  ]);
})(window.angular);
