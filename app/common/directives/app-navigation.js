window.angular && (function(angular) {
  'use strict';

  angular.module('app.common.directives')
      .directive('appNavigation', function() {
        return {
          'restrict': 'E',
          'template': require('./app-navigation.html'),
          'scope': {'path': '=', 'showNavigation': '='},
          'controller': [
            '$scope', '$location', 'dataService', 'userModel', 'APIUtils','$q',
            function($scope, $location, dataService, userModel, APIUtils, $q) {
              $scope.dataService = dataService;
              $scope.showSubMenu = false;
              $scope.change = function(firstLevel) {
                if (firstLevel != $scope.firstLevel) {
                  $scope.firstLevel = firstLevel;
                  $scope.showSubMenu = true;
                } else {
                  $scope.showSubMenu = !$scope.showSubMenu;
                }
              };
              $scope.closeSubnav = function() {
                $scope.showSubMenu = false;
              };
              $scope.$watch('path', function() {
                var urlRoot = $location.path().split('/')[3];
                if (urlRoot != '') {
                  $scope.firstLevel = urlRoot;
                } else {
                  //$scope.firstLevel = 'overview';
				  $scope.firstLevel = 'ssdarray';
                }
                $scope.showSubMenu = false;
              });
              $scope.$watch('showNavigation', function() {
                var paddingTop = 0;
                var urlRoot = $location.path().split('/')[1];
                if (urlRoot != '') {
                  $scope.firstLevel = urlRoot;
                } else {
                  //$scope.firstLevel = 'overview';
				  $scope.firstLevel = 'ssdarray';
                }

                if ($scope.showNavigation) {
                  paddingTop = document.getElementById('header').offsetHeight;
                }
                dataService.bodyStyle = {'padding-top': paddingTop + 'px', 'background-color': 'rgb(207, 221, 251)'}; //'#f0f8ff'
                $scope.navStyle = {'top': paddingTop + 'px'};
              });

            /** add by USI steven 20200616 start **/
            $scope.userName = '';
            $scope.getLogInUserName = function() {
                $scope.userName = userModel.getUserName();
                //console.log($scope.userName);
            };
            $scope.loadUserInfo = function() {
                var users = [];
                APIUtils.getAllUserAccounts().then(
                    function(res) {
                        users = res;
                        for(var i = 0; i < users.length; i++) {
                            if($scope.userName == users[i].UserName){
                                $scope.role = users[i].RoleId;
                                //console.log($scope.role);
                            }
                        }
                    },
                    function(error) {
                      console.log(JSON.stringify(error));
                    }
               );
           };

         $scope.getLogInUserName();
         $scope.loadUserInfo();
         /** add by USI steven 20200616 start **/

            }
          ],
          link: function(scope, element, attributes) {
            var rawNavElement = angular.element(element)[0];
            angular.element(window.document).bind('click', function(event) {
              if (rawNavElement.contains(event.target)) return;

              if (scope.showSubMenu) {
                scope.$apply(function() {
                  scope.showSubMenu = false;
                });
              }
            });
          }
        };
      });
})(window.angular);
