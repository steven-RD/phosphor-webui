/**
 * API utilities service
 *
 * @module app/common/services/usi-api-utils
 * @exports UsiAPIUtils
 * @name UsiAPIUtils
 */

window.angular && (function(angular) {
  'use strict';
  angular.module('app.common.services').factory('UsiAPIUtils', [
    '$http', 'Constants', '$q', 'dataService', '$interval',
    function($http, Constants, $q, DataService, $interval) {
      var SERVICE = {
        // Keep two ways to call interfaces: Restful and Redfish
        uploadSwitchImage: function(file) {
          return $http({
                   method: 'POST',
                   timeout: 5 * 60 * 1000,
                   url: DataService.getHost() + '/upload/switchImage',
                   // Overwrite the default 'application/json' Content-Type
                   headers: {'Content-Type': 'application/octet-stream'},
                   withCredentials: true,
                   data: file
                 })
              .then(function(response) {
                console.log("response.data");
                console.log(response.data);
                return response.data;
              });
        },
        // Restful way start
        /* Modified by USISH Steven20190122/Judy20190521 start */
        getSwitchActivatedStatus: function(callback) {
          $http({
            method: 'GET',
            url: DataService.getHost() +
                '/xyz/openbmc_project/ssdarray/firmware/activate',
            withCredentials: true
          })
          .then(
              function(response) {
                var json = JSON.stringify(response.data);
                var content = JSON.parse(json);
                var dataClone = JSON.parse(JSON.stringify(content.data));
                var switchActivatedStatus = content.data.Value;

                callback(switchActivatedStatus, dataClone);
              },
              function(error) {
                console.log(error);
              });
        },

        getSwitchBeingActiveVersion: function(callback) {
          $http({
            method: 'GET',
            url: DataService.getHost() +
                '/xyz/openbmc_project/ssdarray/firmware/ready',
            withCredentials: true
          })
              .then(
                  function(response) {
                    var json = JSON.stringify(response.data);
                    var content = JSON.parse(json);
                    var version = content.data['Version'];
                    var type = content.data['Type'];
                    callback(version, type);
                  },
                  function(error) {
                    console.log(error);
                  });
        },

        getSwitchActivedVersion: function(callback) {
          $http({
            method: 'GET',
            url: DataService.getHost() +
                '/xyz/openbmc_project/ssdarray/firmware/functional',
            withCredentials: true
          })
              .then(
                  function(response) {
                    var json = JSON.stringify(response.data);
                    var content = JSON.parse(json);
                    var FirmwareVersion = content.data['Version']['FirmwareImage'];
                    var ConfigurationFile = content.data['Version']['ConfigurationFile'];
                    callback(FirmwareVersion, ConfigurationFile);
                  },
                  function(error) {
                    console.log(error);
                  });
        },

        getSwitchFirmware: function() {
          var deferred = $q.defer();
          $http({
            method: 'GET',
            url: DataService.getHost() +
                '/xyz/openbmc_project/ssdarray/firmware/imagefile',
            withCredentials: true
          })
              .then(
                  function(response) {
                    var json = JSON.stringify(response.data);
                    var content = JSON.parse(json);
                    deferred.resolve(content.data);
                  },
                  function(error) {
                    console.log(error);
                    deferred.reject(error);
                  })
          return deferred.promise;
        },

        deleteSwitchImage: function(val) {
          return $http({
                   method: 'PUT',
                   url: DataService.getHost() +
                       '/xyz/openbmc_project/ssdarray/firmware/delete/attr/Value',
                   withCredentials: true,
                   data: JSON.stringify({'data': val})
                 })
              .then(function(response) {
                var json = JSON.stringify(response.data);
                var content = JSON.parse(json);
                return content;
              });
        },
        getDeleteSwitchImage: function() {
          return $http({
                   method: 'GET',
                   url: DataService.getHost() +
                       '/xyz/openbmc_project/ssdarray/firmware/delete',
                   withCredentials: true,
                 })
              .then(function(response) {
                var json = JSON.stringify(response.data);
                var content = JSON.parse(json);
                return content.data;
              });
        },
        updateImage: function(val) {
          var deferred = $q.defer();
          $http({
             method: 'PUT',
            url: DataService.getHost() + '/xyz/openbmc_project/ssdarray/firmware/update/attr/Value',
            withCredentials: true,
            timeout: 5 * 60 * 1000, // 5min
            data:
                JSON.stringify({'data': val}),
          })
           .then(
                  function(response) {
                    var json = JSON.stringify(response.data);
                    var content = JSON.parse(json);
                    deferred.resolve(content);
                  },
                  function(error) {
                    console.log("updateImage error");
                    console.log(error);
                    deferred.reject(error);
                  }
                );
          return deferred.promise;
        },

        runSwitchImage: function(val) {
          var deferred = $q.defer();
          $http({
            method: 'PUT',
            url: DataService.getHost() + '/xyz/openbmc_project/ssdarray/firmware/activate/attr/Value',
            withCredentials: true,
            data:
                JSON.stringify({'data': val})
          })
          .then(
              function(response) {
                var json = JSON.stringify(response.data);
                var content = JSON.parse(json);
                deferred.resolve(content);
              },
              function(error) {
                console.log(error);
                deferred.reject(error);
              });
          return deferred.promise;
        },

        getSsdArrayInfo: function(){
            return $http({
                   method: 'GET',
                   url: DataService.getHost() +
                       '/xyz/openbmc_project/ssdarray/info',
                   withCredentials: true
                 })
                .then(function(response) {
                   var json = JSON.stringify(response.data);
                   var content = JSON.parse(json);
                   return content['data']['Info'];
                },
                function(error) {
                   console.log(error);
                });
        },
        getPowerSupplyInfo: function(){
            return $http({
                   method: 'GET',
                   url: DataService.getHost() +
                       '/xyz/openbmc_project/ssdarray/powersupply',
                   withCredentials: true
                 })
                .then(function(response) {
                   var json = JSON.stringify(response.data);
                   var content = JSON.parse(json);
                   return content['data'];
                },
                function(error) {
                   console.log(error);
                });
        },

        setPowerSwitchState: function(state) {
          var deferred = $q.defer();
          $http({
              method: 'PUT',
              url: DataService.getHost() +
                '/xyz/openbmc_project/ssdarray/control/attr/Command',
              withCredentials: true,
              data: JSON.stringify({'data': state})
          })
          .then(
              function(response) {
                var json = JSON.stringify(response.data);
                var content = JSON.parse(json);
                deferred.resolve(content.status);
              },
              function(error) {
                deferred.reject(error);
              });
          return deferred.promise;
        },
        getPowerSwitchStatus: function() {
          var deferred = $q.defer();
          $http({
              method: 'GET',
              url: DataService.getHost() + '/xyz/openbmc_project/ssdarray/powerswitch',
              withCredentials: true
          })
          .then(
              function(response) {
                var json = JSON.stringify(response.data);
                var content = JSON.parse(json);
                deferred.resolve(content.data);
              },
              function(error) {
                deferred.reject(error);
              });
          return deferred.promise;
        },
      /* Modified by USISH Steven20190122/Judy20190521 end */
      // Restful way end
      // Redfish way start
      /* Modified by USISH Judy20190702 start */
        /*getSwitchActivatedStatus: function(callback) {
          $http({
            method: 'GET',
            url: DataService.getHost() + '/redfish/v1/Switch/Activate',
            withCredentials: true
          })
          .then(
              function(response) {
                var json = JSON.stringify(response.data);
                var content = JSON.parse(json);
                var dataClone = JSON.parse(JSON.stringify(content));
                var switchActivatedStatus = content.Value;

                callback(switchActivatedStatus, dataClone);
              },
              function(error) {
                console.log(error);
              });
        },

        getSwitchBeingActiveVersion: function(callback) {
          $http({
            method: 'GET',
            url: DataService.getHost() + '/redfish/v1/Switch/Ready',
            withCredentials: true
          })
              .then(
                  function(response) {
                    var json = JSON.stringify(response.data);
                    var content = JSON.parse(json);
                    var version = content['Version'];
                    var type = content['Type'];
                    callback(version, type);
                  },
                  function(error) {
                    console.log(error);
                  });
        },

        getSwitchActivedVersion: function(callback) {
          $http({
            method: 'GET',
            url: DataService.getHost() + '/redfish/v1/Switch/Functional',
            withCredentials: true
          })
              .then(
                  function(response) {
                    var json = JSON.stringify(response.data);
                    var content = JSON.parse(json);
                    var FirmwareVersion = content['Version']['FirmwareImage'];
                    var ConfigurationFile = content['Version']['ConfigurationFile'];
                    callback(FirmwareVersion, ConfigurationFile);
                  },
                  function(error) {
                    console.log(error);
                  });
        },

        getSwitchFirmware: function() {
          var deferred = $q.defer();
          $http({
            method: 'GET',
            url: DataService.getHost() + '/redfish/v1/Switch/ImageFile',
            withCredentials: true
          })
              .then(
                  function(response) {
                    var json = JSON.stringify(response.data);
                    var content = JSON.parse(json);
                    deferred.resolve({'Status': content['Status']});
                  },
                  function(error) {
                    console.log(error);
                    deferred.reject(error);
                  })
          return deferred.promise;
        },

        deleteSwitchImage: function(val) {
          return $http({
                   method: 'PATCH',
                   url: DataService.getHost() + '/redfish/v1/Switch/Delete',
                   withCredentials: true,
                   data: JSON.stringify({'Value': val})
                 })
              .then(function(response) {
                var json = JSON.stringify(response.data);
                var content = JSON.parse(json);
                return content;
              });
        },
        getDeleteSwitchImage: function() {
          return $http({
                   method: 'GET',
                   url: DataService.getHost() + '/redfish/v1/Switch/Delete',
                   withCredentials: true,
                 })
              .then(function(response) {
                var json = JSON.stringify(response.data);
                var content = JSON.parse(json);
                return content;
              });
        },

        updateImage: function(val) {
          var deferred = $q.defer();
          $http({
            method: 'PATCH',
            url: DataService.getHost() + '/redfish/v1/Switch/Update',
            withCredentials: true,
            timeout: 5 * 60 * 1000, // 5min
            data: {'Value': val}
          })
           .then(
                  function(response) {
                    var json = JSON.stringify(response.data);
                    var content = JSON.parse(json);
                    deferred.resolve(content);
                    console.log(content);
                  },
                  function(error) {
                    console.log(error);
                    deferred.reject(error);
                  }
                );
          return deferred.promise;
        },

        runSwitchImage: function(val) {
          var deferred = $q.defer();
          $http({
            method: 'PATCH',
            url: DataService.getHost() + '/redfish/v1/Switch/Activate',
            withCredentials: true,
            data: {'Value': val}
          })
          .then(
              function(response) {
                var json = JSON.stringify(response.data);
                var content = JSON.parse(json);
                deferred.resolve(content);
              },
              function(error) {
                console.log(error);
                deferred.reject(error);
              });
          return deferred.promise;
        },

        getSsdArrayInfo: function(){
            return $http({
                   method: 'GET',
                   url: DataService.getHost() +
                       '/redfish/v1/Switch/AllInformations',
                   withCredentials: true
                 })
                .then(function(response) {
                   var json = JSON.stringify(response.data);
                   var content = JSON.parse(json);
                   return content['Info'];
                },
                function(error) {
                   console.log(error);
                });
        },
        getPowerSupplyInfo: function(){
            return $http({
                   method: 'GET',
                   url: DataService.getHost() +
                       '/redfish/v1/Switch/PowerSupply',
                   withCredentials: true
                 })
                .then(function(response) {
                   var json = JSON.stringify(response.data);
                   var content = JSON.parse(json);
                   return content;
                },
                function(error) {
                   console.log(error);
                });
        },

        setPowerSwitchState: function(state) {
          var deferred = $q.defer();
          $http({
              method: 'PATCH',
              url: DataService.getHost() + '/redfish/v1/Switch/Control',
              withCredentials: true,
              data: {'Command': state}
          })
          .then(
              function(response) {
                var json = JSON.stringify(response.data);
                var content = JSON.parse(json);
                deferred.resolve(content);
              },
              function(error) {
                deferred.reject(error);
              });
          return deferred.promise;
        },
        getPowerSwitchStatus: function() {
          var deferred = $q.defer();
          $http({
              method: 'GET',
              url: DataService.getHost() + '/redfish/v1/Switch/PowerSwitch',
              withCredentials: true
          })
          .then(
              function(response) {
                var json = JSON.stringify(response.data);
                var content = JSON.parse(json);
                deferred.resolve(content);
              },
              function(error) {
                deferred.reject(error);
              });
          return deferred.promise;
        },*/
      /*  Modified by USISH Judy20190702 end */
      // Redfish way end
      };
      return SERVICE;
    }
  ]);
})(window.angular);
