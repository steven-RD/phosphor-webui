/**
 * Controller for systemOverview
 *
 * @module app/overview
 * @exports systemOverviewController
 * @name systemOverviewController
 */

window.angular && (function(angular) {
  'use strict';

  angular.module('app.overview').controller('systemOverviewController', [
    '$scope', '$window', 'APIUtils', 'UsiAPIUtils', 'dataService', 'Constants', 'toastService', '$q',
    function($scope, $window, APIUtils, UsiAPIUtils, dataService, Constants, toastService, $q) {
      $scope.dataService = dataService;
      $scope.dropdown_selected = false;
      $scope.logs = [];
      $scope.server_info = {};
      $scope.bmc_firmware = '';
      $scope.bmc_time = '';
      $scope.server_firmware = '';
      $scope.power_consumption = '';
      $scope.power_cap = '';
      $scope.bmc_ip_addresses = [];
      $scope.loading = false;
      $scope.edit_hostname = false;
      $scope.newHostname = '';

      loadOverviewData();
	  
	  
	  //$scope.dataService = dataService;
      $scope.confirm = false;
      APIUtils.getLastRebootTime().then(
          function(data) {
            $scope.reboot_time = data.data;
          },
          function(error) {
            console.log(JSON.stringify(error));
          });
/*       $scope.rebootConfirm = function() {
          if ($scope.confirm) {
			return;
		  }
          $scope.confirm = true;
      };
      $scope.reboot = function() {
          APIUtils.bmcReboot().then(
              function(response) {
                  toastService.success('BMC is rebooting.')
              },
              function(error) {
				console.log(JSON.stringify(error));
				toastService.error('Unable to reboot BMC.');
              });
      };
	   */

      function loadOverviewData() {
        $scope.loading = true;

        var getLogsPromise = APIUtils.getLogs().then(
            function(data) {
              $scope.logs = data.data.filter(function(log) {
                return log.severity_flags.high == true;
              });
            },
            function(error) {
              console.log(JSON.stringify(error));
            });

        var getFirmwaresPromise = APIUtils.getFirmwares().then(
            function(data) {
              $scope.bmc_firmware = data.bmcActiveVersion;
              $scope.server_firmware = data.hostActiveVersion;
            },
            function(error) {
              console.log(JSON.stringify(error));
            });

        var getLEDStatePromise = APIUtils.getLEDState().then(
            function(data) {
              if (data == APIUtils.LED_STATE.on) {
                dataService.LED_state = APIUtils.LED_STATE_TEXT.on;
              } else {
                dataService.LED_state = APIUtils.LED_STATE_TEXT.off;
              }
            },
            function(error) {
              console.log(JSON.stringify(error));
            });

        var getBMCTimePromise = APIUtils.getBMCTime().then(
            function(data) {
              $scope.bmc_time = data.data.Elapsed / 1000;
            },
            function(error) {
              console.log(JSON.stringify(error));
            });

        var getServerInfoPromise = APIUtils.getServerInfo().then(
            function(data) {
              $scope.server_info = data.data;
            },
            function(error) {
              console.log(JSON.stringify(error));
            });

        var getPowerConsumptionPromise = APIUtils.getPowerConsumption().then(
            function(data) {
              $scope.power_consumption = data;
            },
            function(error) {
              console.log(JSON.stringify(error));
            });

        var getPowerCapPromise = APIUtils.getPowerCap().then(
            function(data) {
              if (data.data.PowerCapEnable == false) {
                $scope.power_cap = Constants.POWER_CAP_TEXT.disabled;
              } else {
                $scope.power_cap =
                    data.data.PowerCap + ' ' + Constants.POWER_CAP_TEXT.unit;
              }
            },
            function(error) {
              console.log(JSON.stringify(error));
            });

        var getNetworkInfoPromise = APIUtils.getNetworkInfo().then(
            function(data) {
              // TODO: openbmc/openbmc#3150 Support IPV6 when
              // officially supported by the backend
              $scope.bmc_ip_addresses = data.formatted_data.ip_addresses.ipv4;
              $scope.newHostname = data.hostname;
            },
            function(error) {
              console.log(JSON.stringify(error));
            });

        // Judy modified at 20190627 start
        // Get power switch state when loading overview page.
        var getSwitchPowerStatePromise = UsiAPIUtils.getPowerSwitchStatus().then(
            function(info){
              $scope.switch_state = info.Status;
            },
            function(error) {
              console.log(JSON.stringify(error));
            });

			$scope.loadSwitchFirmware = function() {
            UsiAPIUtils.getSwitchFirmware()
            .then(
                function(result) {
					console.log(result);
                    $scope.firmwares = result;
                    $scope.loadSwitchBeingActiveVersion();
                    $scope.loadSwitchActivedVersion();
                },
                function(error) {
                    console.log(error);
                }
            );
        };

        $scope.loadSwitchBeingActiveVersion = function() {
            UsiAPIUtils.getSwitchBeingActiveVersion(function(version, type) {
                $scope.switchVersion = version;
                $scope.switchType = type;
				console.log(version);
				console.log(type);
            },
            function(error){
                console.log(error)
            });
        };

        $scope.loadSwitchActivedVersion = function() {
            UsiAPIUtils.getSwitchActivedVersion(
              function(firmwareVersion, configurationFile) {
                $scope.switchActivedVersion = firmwareVersion;
                $scope.configurationFile = configurationFile;
				console.log(firmwareVersion);
				console.log(configurationFile);
              },
              function(error){
                console.log(error)
              }
            );
        };
		$scope.loadSwitchFirmware();
        // Judy modified at 20190627 end

        var promises = [
          getLogsPromise,
          getFirmwaresPromise,
          getLEDStatePromise,
          getBMCTimePromise,
          //getServerInfoPromise,
          //getPowerConsumptionPromise,
          //getPowerCapPromise,
          getNetworkInfoPromise,
          getSwitchPowerStatePromise, // Judy add at 20190627
        ];

        $q.all(promises).finally(function() {
          $scope.loading = false;
        });
      }

      $scope.toggleLED = function() {
        var toggleState =
            (dataService.LED_state == APIUtils.LED_STATE_TEXT.on) ?
            APIUtils.LED_STATE.off :
            APIUtils.LED_STATE.on;
        dataService.LED_state =
            (dataService.LED_state == APIUtils.LED_STATE_TEXT.on) ?
            APIUtils.LED_STATE_TEXT.off :
            APIUtils.LED_STATE_TEXT.on;
        APIUtils.setLEDState(toggleState, function(status) {});
      };

      // Judy modified at 20190527 start
      $scope.toggleSwitchPower = function() {
          /*
            Set power switch state.
            if success, get power switch status and update.
          */
        var toggleState =
          ($scope.switch_state == 'Power On') ? 'poweroff switch' : 'poweron switch';
        UsiAPIUtils.setPowerSwitchState(toggleState).then(
            function(data) {
              UsiAPIUtils.getPowerSwitchStatus().then(
                  function(info){
                     $scope.switch_state = info.Status;
                  },
                  function(error) {
                    console.log(JSON.stringify(error));
                  });
            },
            function(error) {
              console.log(JSON.stringify(error));
            });
      };
      // Judy modified at 20190527 end

      $scope.saveHostname = function(hostname) {
        $scope.edit_hostname = false;
        $scope.loading = true;
        APIUtils.setHostname(hostname).then(
            function(data) {
              APIUtils.getNetworkInfo().then(function(data) {
                dataService.setNetworkInfo(data);
              });
            },
            function(error) {
              console.log(error);
            });
        $scope.loading = false;
      };

      $scope.getEventLogTitle = function(event) {
        var title = event.type;
        if ((event.eventID != 'None') && (event.description != 'None')) {
          title = event.eventID + ': ' + event.description;
        }
        return title;
      };
    }
  ]);
})(angular);
