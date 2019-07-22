/**
 * A module for the configuration
 *
 * @module app/configuration/index
 * @exports app/configuration/index
 *
 * Separate from official configuration
 * USI Judy 20190722
 */

window.angular && (function(angular) {
  'use strict';

  angular
      .module('app.configuration', ['ngRoute', 'app.common.services'])
      // Route configuration
      .config([
        '$routeProvider',
        function($routeProvider) {
          $routeProvider
              .when('/configuration/switch-firmware', {
                'template': require('./controllers/switch-firmware-controller.html'),
                'controller': 'switchFirmwareController',
                authenticated: true
              });
        }
      ]);
})(window.angular);
