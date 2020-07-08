/**
 * A module for the usi_extend
 *
 * @module app/usi_extend/help/index
 * @exports app/usi_extend/help/index
 */

window.angular && (function(angular) {
  'use strict';

  angular
      .module('app.usiExtend.help', ['ngRoute', 'app.common.services'])
      // Route configuration
      .config([
        '$routeProvider',
        function($routeProvider) {
          $routeProvider
              /* .when('/overview/server', {
                'template':
                    require('./controllers/system-overview-controller.html'),
                'controller': 'systemOverviewController',
                authenticated: true
              })
              .when('/overview', {
                'template':
                    require('./controllers/system-overview-controller.html'),
                'controller': 'systemOverviewController',
                authenticated: true
              }) */
              .when('/usi_extend/help', {
                'template':
                    require('../../usi_extend/help/controllers/help-controller.html'),
                'controller': 'helpController',
                authenticated: true
              })
              .when('/usi_extend/help/server', {
                'template':
                    require('../../usi_extend/help/controllers/help-controller.html'),
                'controller': 'helpController',
                authenticated: true
              })
			  .when('/usi_extend/inventory-help', {
                'template':
                    require('../../usi_extend/help/controllers/inventory-help-controller.html'),
                'controller': 'inventoryHelpController',
                authenticated: true
              })
			  .when('/usi_extend/control-help', {
                'template':
                    require('../../usi_extend/help/controllers/control-help-controller.html'),
                'controller': 'controlHelpController',
                authenticated: true
              });
        }
      ]);
})(window.angular);
