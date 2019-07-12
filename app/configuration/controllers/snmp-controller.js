/**
 * Controller for SNMP
 *
 * @module app/configuration
 * @exports snmpController
 * @name snmpController
 */

window.angular && (function(angular) {
  'use strict';

  angular.module('app.configuration').controller('snmpController', [
    '$scope', 'APIUtils', 'dataService', '$location', '$route',
    'Constants', '$interval', '$q', '$timeout', 'toastService',
    function(
        $scope, APIUtils, dataService, $location, $route,
        Constants, $interval, $q, $timeout, toastService) {
        $scope.dataService = dataService;

        // Judy add 20190612
        $scope.switchInfo = {switchActivedVersion: '', configurationFile: '',
                             toBeActiveVersion: '', type: '',
                             switchActivatedStatus: '',
                             switchUpdateStatus: '',
                             updating: false};
        $scope.firmwares = [];
        $scope.switchActiveVersion = '';
        $scope.display_error = false;
        $scope.activate_confirm = false;
        $scope.delete_image_id = '';
        $scope.delete_image_version = '';
        $scope.activate_image_id = '';
        $scope.activate_image_version = '';
        $scope.activate_image_type = '';
        $scope.file_empty = true;
        $scope.uploading = false;
        $scope.upload_success = false;
        $scope.activate = {reboot: true};
        $scope.download_error_msg = '';
        $scope.download_success = false;
        $scope.confirm_updating = false; // Judy add 20190702

        var pollActivationTimer = undefined;
        var pollDownloadTimer = undefined;

        $scope.filters = {bmc: {imageType: 'BMC'}, Switch: {imageType: 'Host'}};
        $scope.error = {modal_title: '', title: '', desc: '', type: 'warning'};

        $scope.displayError = function(data) {
            $scope.error = data;
            $scope.display_error = true;
            console.log(data);
        };

        $scope.upload = function() {
          if ($scope.file) {
            $scope.uploading = true;
            $scope.upload_success = false;
            var upload_flag = true;

            APIUtils.getSwitchFirmware()
            .then(
                function(result) {
                    $scope.firmwares = result.data;
                    // If exist one switch image, can't upload another one.
                    angular.forEach($scope.firmwares, function(firmware){
                        if (firmware.Version != 'None'){
                            upload_flag = false;
                            $scope.uploading = false;
                            toastService.error("Upload image fail. Exist toBeActive image.");
                        }
                    })
                    if (upload_flag) {
                      APIUtils.uploadSwitchImage($scope.file)
                      .then(
                        function(response) {
                            $scope.file = '';
                            $scope.uploading = false;
                            $scope.upload_success = true;
                            $scope.loadSwitchFirmware();
                            $scope.loadSwitchUpdateStatus();
                            $scope.loadSwitchActivatedStatus();
                        },
                        function(error) {
                            $scope.uploading = false;
                            toastService.error("Upload image error");
                        });
                    }
                },
                function(error) {
                    $scope.uploading = false;
                    toastService.error("Upload image error when check SwitchFirmware");
                });
          }
        };

        function waitForDownload() {
            var deferred = $q.defer();
            var startTime = new Date();
            pollDownloadTimer = $interval(function() {
                var now = new Date();
                if ((now.getTime() - startTime.getTime()) >=
                    Constants.TIMEOUT.DOWNLOAD_IMAGE) {
                    $interval.cancel(pollDownloadTimer);
                    pollDownloadTimer = undefined;
                    deferred.reject(
                    new Error(Constants.MESSAGES.POLL.DOWNLOAD_IMAGE_TIMEOUT));
                }

                APIUtils.getFirmwares().then(
                    function(response) {
                        if (response.data.length === $scope.firmwares.length + 1) {
                            $interval.cancel(pollDownloadTimer);
                            pollDownloadTimer = undefined;
                            deferred.resolve(response.data);
                        }
                    },
                    function(error) {
                        $interval.cancel(pollDownloadTimer);
                        pollDownloadTimer = undefined;
                        deferred.reject(error);
                    });
            }, Constants.POLL_INTERVALS.DOWNLOAD_IMAGE);

            return deferred.promise;
        }

        $scope.download = function() {
            $scope.download_success = false;
            $scope.download_error_msg = '';
            if (!$scope.download_host || !$scope.download_filename) {
                $scope.download_error_msg = 'Field is required!';
                return false;
            }
            $scope.downloading = true;
            APIUtils.getFirmwares()
            .then(function(response) {
                $scope.firmwares = response.data;
            })
            .then(function() {
                return APIUtils
                    .downloadImage($scope.download_host, $scope.download_filename)
                    .then(function(downloadStatus) {
                    return downloadStatus;
                });
            })
            .then(function(downloadStatus) {
              return waitForDownload();
            })
            .then(
                function(newFirmwareList) {
                    $scope.download_host = '';
                    $scope.download_filename = '';
                    $scope.downloading = false;
                    $scope.download_success = true;
                    $scope.loadSwitchFirmware();
                },
                function(error) {
                    console.log(error);
                    $scope.displayError({
                        modal_title: 'Error during downloading Image',
                        title: 'Error during downloading Image',
                        desc: error,
                        type: 'Error'
                    });
                    $scope.downloading = false;
                });
        };

        $scope.deleteImage = function(Name, Version) {
            $scope.delete_image_id = Name;
            $scope.delete_image_version = Version;
            $scope.confirm_delete = true;
        };

        $scope.confirmDeleteImage = function() {
            $scope.loading = true;
            APIUtils.deleteSwitchImage(1).then(function(response) {
                $scope.loading = false;
                console.log(response);
                if (response.status == 'error') {
                    $scope.displayError({
                        modal_title: response.data.description,
                        title: response.data.description,
                        desc: response.data.exception,
                        type: 'Error'
                    });
                } else {
                    $scope.loadSwitchFirmware();
                }
            });
            $scope.confirm_delete = false;
        };

        $scope.fileNameChanged = function() {
            $scope.file_empty = false;
        };

        $scope.loadSwitchFirmware = function() {
          APIUtils.getSwitchFirmware()
            .then(
                function(result) {
                    $scope.firmwares = result.data;
                    console.log("$scope.firmwares");
                    console.log($scope.firmwares);
                    $scope.loadSwitchBeingActiveVersion();
                    $scope.loadSwitchActivedVersion();
                },
                function(error) {
                    console.log(error);
                }
            );
        };

        $scope.loadSwitchBeingActiveVersion = function() {
            APIUtils.getSwitchBeingActiveVersion(function(version, type) {
                $scope.switchInfo.toBeActiveVersion = version;
                $scope.switchInfo.type = type;

                $scope.$emit('exist_toBeActiveVersion', {});
            },
            function(error){
                console.log(error)
            });
        };

        $scope.loadSwitchActivedVersion = function() {
            APIUtils.getSwitchActivedVersion(function(firmwareVersion, configurationFile) {
                $scope.switchInfo.switchActivedVersion = firmwareVersion;
                $scope.switchInfo.configurationFile = configurationFile;
            },
            function(error){
                console.log(error)
            });
        };

        $scope.loadSwitchUpdateStatus = function(){
            APIUtils.getSwitchUpdateStatus(function(data, originalData) {
                var UpdateStatus = data.toString();
                /*
                    0: initial; 1: Updating; 2: Update OK; 3: Update Fail
                */
                $scope.switchInfo.switchUpdateStatus = UpdateStatus;
            },
            function(error){
                console.log(error)
            });
        };

        $scope.loadSwitchActivatedStatus = function(){
            APIUtils.getSwitchActivatedStatus(function(data, originalData) {
                var ActivatedStatus = data.toString();
                $scope.switchInfo.switchActivatedStatus = ActivatedStatus;
            },
            function(error) {
              console.log(error);
            });
        };

        $scope.updateImage = function(imageId, imageVersion, imageType) {
            // Realize
            $scope.updateImageDetail(imageId, imageVersion, imageType);
            // reload page
            $scope.$on('update-image-detail', function() {
                $timeout(function() {
                    $scope.switchInfo.updating = false;
                    $scope.confirm_updating = false;
                    $route.reload();
                }, 2*60*1000);
            })
        }

        $scope.updateImageDetail = function(Name, Version, Type) {
            /*
                Set the update status as 1, then switch firmware start to update.
                    if success, return 2:
                        Update switch BeingActiveVersion;
                        Update SwitchUpdateStatus.
                    if fail, return 3:
                        Update SwitchUpdateStatus.
            */
            $scope.activate_image_id = Name;
            $scope.activate_image_version = Version;
            $scope.activate_image_type = Type;
            $scope.switchInfo.updating = true;
            $scope.confirm_updating = true;

            // Check whether image has already been actived.
            APIUtils.getSwitchActivedVersion(function(fwVersion, confFile) {
                if (confFile != ""){
                    confFile = 'v' + confFile;
                }
                if (confFile == Version){
                    toastService.error('This image has already been actived!');
                }
              },
              function(error) {
                console.log(error);
              });

            APIUtils.updateImage(1)    // update process success
            .then(
                function(state){
                    APIUtils.getSwitchUpdateStatus(function(data, originalData) {
                        var updateStatus = data.toString();
                        if (updateStatus == '2'){    // 2 update status success
                            $scope.loadSwitchBeingActiveVersion();
                            $scope.loadSwitchUpdateStatus();
                            toastService.success('Update image success');
                        }
                        if (updateStatus == '3'){    // 3 update status fail
                            $scope.loadSwitchUpdateStatus();
                            toastService.error(Version + ' update image fail, value 3');
                        }
                        $scope.$emit('update-image-detail', {});
                    },
                    function(error) {
                      console.log("Get switch update status error.");
                    });
                },
                function(error){    // update process error
                    toastService.error('Error during update status process');
                    $scope.$emit('update-image-detail', {});
                }
            );
            $scope.$emit('update-image-detail', {});
        };

        $scope.runImage = function(Name, Version, Type) {
            $scope.activate_image_id = Name;
            $scope.activate_image_version = Version;
            $scope.activate_image_type = Type;
            $scope.activate_confirm = true;

            $scope.delete_image_id = Name; // for delete usage
        };

        $scope.runConfirmed = function() {
            // Realize
            $scope.runConfirmedDetail();
            // reload page
            $scope.$on('run-confirmed-success', function() {
                $route.reload();
            })
        }

        $scope.runConfirmedDetail = function() {
            console.log('first $scope.delete_image_id');
            console.log($scope.delete_image_id);
            console.log($scope.activate_image_id);
            APIUtils.runSwitchImage(1)
            .then(
                function(state) {    // active success
                    APIUtils.getSwitchActivatedStatus(function(data, originalData) {
                        var activatedStatus = data.toString();
                        if (activatedStatus == '2'){
                            $scope.loadSwitchFirmware();
                            $scope.loadSwitchActivedVersion();
                            $scope.loadSwitchActivatedStatus();
                            return state;
                        }
                        if (activatedStatus == '3'){
                            $scope.loadSwitchActivatedStatus();
                            toastService.error('Error during activate status');
                        }
                    },
                    function(error) {
                      console.log('Error during get switch activated status.');
                    });
                },
                function(error) {    // active fail
                    toastService.error('Error during run image.');
                });
            $scope.activate_confirm = false;
            $scope.$emit('run-confirmed-success', {});
        };

        $scope.loadSwitchFirmware();
        $scope.loadSwitchBeingActiveVersion();
        $scope.loadSwitchActivedVersion();
        $scope.loadSwitchUpdateStatus();
        $scope.loadSwitchActivatedStatus();
    }
  ]);
})(angular);
