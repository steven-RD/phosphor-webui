/**
 * Controller for Switch Firmware
 *
 * @module app/configuration
 * @exports switchFirmwareController
 * @name switchFirmwareController
 */

window.angular && (function(angular) {
  'use strict';

  angular.module('app.configuration').controller('switchFirmwareController', [
    '$scope', 'APIUtils', 'UsiAPIUtils', 'dataService', '$route', 'Constants',
    '$interval', '$timeout', 'toastService', '$location', '$anchorScroll','$q',
    function(
        $scope, APIUtils, UsiAPIUtils, dataService, $route, Constants,
        $interval, $timeout, toastService, $location, $anchorScroll, $q) {
        $scope.dataService = dataService;
		
		 // Scroll to target anchor
        $scope.gotoAnchor = function() {
			$location.hash('upload');
			$anchorScroll();
        };

        // Display switchInfo at switch firmware list html
        $scope.switchInfo = {switchActivedVersion: '', configurationFile: '',
                             toBeActiveVersion: '', type: '', activing: false,
                             switchActivatedStatus: '', updating: false};
        $scope.firmwares = [];
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
        $scope.download_error_msg = '';
        $scope.download_success = false;
        $scope.confirm_updating = false; // Judy add 20190702

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

            UsiAPIUtils.getSwitchFirmware()
            .then(
                function(result) {
                    $scope.firmwares = result;
                    // If exist one switch image, can't upload another one.
                    angular.forEach($scope.firmwares, function(firmware){
                        if (firmware.Version != 'None'){
                            upload_flag = false;
                            $scope.uploading = false;
                            toastService.error("Upload image fail. Exist toBeActive image.");
                        }
                    })
                    if (upload_flag) {
                      UsiAPIUtils.uploadSwitchImage($scope.file)
                      .then(
                        function(response) {
                            $scope.file = '';
                            $scope.uploading = false;
                            $scope.upload_success = true;
                            $scope.loadSwitchFirmware();
                            $scope.loadSwitchActivatedStatus();
                            toastService.success("Upload image success.");
                        },
                        function(error) {
                            $scope.uploading = false;
                            toastService.error("Upload image error.");
                        });
                    }
                },
                function(error) {
                    $scope.uploading = false;
                    toastService.error("Upload image error when check SwitchFirmware.");
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

                UsiAPIUtils.getSwitchFirmware().then(
                    function(response) {
						console.log("waitForDownload");
						console.log(response);
						console.log(response.Status);
                        if (response.Status != '') {
                            $interval.cancel(pollDownloadTimer);
                            pollDownloadTimer = undefined;
                            deferred.resolve(response.Status);
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
            UsiAPIUtils.getSwitchFirmware()
            .then(function(response) {
                $scope.firmwares = response.Status;
				console.log("downloading");
				console.log($scope.firmwares);
            })
            .then(function() {
                return APIUtils
                    .downloadImage($scope.download_host, $scope.download_filename)
                    .then(function(downloadStatus) {
						console.log(downloadStatus);
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
            UsiAPIUtils.deleteSwitchImage(1).then(
              function(response) {
                $scope.loading = false;
                UsiAPIUtils.getDeleteSwitchImage().then(
                  function(content) {
                    if (content.hasOwnProperty('Value')){
                        if (content['Value'] == 2) {
                            toastService.success('Image delete ok!');
                        }
                        if (content['Value'] == 3) {
                            toastService.error('Image delete fail!');
                        }
                    }
                  })
                  .then(function(){
                      $route.reload();
                  })
              });
            $scope.confirm_delete = false;
        };

        $scope.fileNameChanged = function() {
            $scope.file_empty = false;
        };

        $scope.loadSwitchFirmware = function() {
          UsiAPIUtils.getSwitchFirmware()
            .then(
                function(result) {
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
                $scope.switchInfo.toBeActiveVersion = version;
                $scope.switchInfo.type = type;
            },
            function(error){
                console.log(error)
            });
        };

        $scope.loadSwitchActivedVersion = function() {
            UsiAPIUtils.getSwitchActivedVersion(
              function(firmwareVersion, configurationFile) {
                $scope.switchInfo.switchActivedVersion = firmwareVersion;
                $scope.switchInfo.configurationFile = configurationFile;
              },
              function(error){
                console.log(error)
              }
            );
        };

        $scope.loadSwitchActivatedStatus = function(){
            UsiAPIUtils.getSwitchActivatedStatus(function(data, originalData) {
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
                }, 0);
            })
        }

        $scope.updateImageDetail = function(Name, Version, Type) {
            /*
                First update switch firmware, then get switch BeingActiveVersion
            */
            $scope.activate_image_id = Name;
            $scope.activate_image_version = Version;
            $scope.activate_image_type = Type;
            $scope.switchInfo.updating = true;
            $scope.confirm_updating = true;

            // Check whether image has already been actived.
            UsiAPIUtils.getSwitchActivedVersion(
              function(fwVersion, confFile) {
                if (confFile == Version){
                    $scope.switchInfo.updating = false;
                    toastService.error('This image has already been actived!');
                }
              },
              function(error) {
                console.log(error);
              }
            );

            UsiAPIUtils.updateImage(1)    // update image
            .then(
                function(state){
                    UsiAPIUtils.getSwitchBeingActiveVersion( // Get ready sw image
                      function(version, type) {
                        if (version == 'None'){
                            toastService.error('Update switch image fail.');
                        }else{
                            toastService.success('Update success. Get existing image.');
                        }
                      },
                      function(error){
                        console.log(error);
                        toastService.error('Update fail, no existing image.');
                      }
                    );
                },
                function(error){    // update process error
                    console.log(error);
                    toastService.error('Error during update status process.');
                }
            )
            .then(
                function(){
                    $scope.$emit('update-image-detail', {});
                }
            );
        };

        $scope.runImage = function(Name, Version, Type) {
            $scope.activate_image_id = Name;
            $scope.activate_image_version = Version;
            $scope.activate_image_type = Type;
            $scope.activate_confirm = true;
        };

        $scope.runConfirmed = function() {
            // Realize
            $scope.runConfirmedDetail();
            // reload page
            $scope.$on('run-confirmed-success', function() {
                $scope.switchInfo.activing = false;
                $route.reload();
            })
        }

        $scope.runConfirmedDetail = function() {
            $scope.activate_confirm = false;
            $scope.switchInfo.activing = true;
            UsiAPIUtils.runSwitchImage(1)
            .then(
                function(state) {    // active success
                    UsiAPIUtils.getSwitchActivatedStatus(function(data, originalData) {
                        var activatedStatus = data.toString();
                        if (activatedStatus == '2'){
                            $scope.loadSwitchFirmware();
                            $scope.loadSwitchActivedVersion();
                            $scope.loadSwitchActivatedStatus();
                        }
                        if (activatedStatus == '3'){
                            $scope.loadSwitchActivatedStatus();
                            toastService.error('Error during activate status.');
                        }
                    },
                    function(error) {
                      console.log(error);
                      toastService.error('Error during get SwitchActivatedStatus.');
                    });
                },
                function(error) {    // active fail
                    console.log(error);
                    toastService.error('Error during run image.');
                }
            )
            .then(
                function(){
                    $scope.$emit('run-confirmed-success', {});
                }
            );
        };

        $scope.loadSwitchFirmware();
        $scope.loadSwitchBeingActiveVersion();
        $scope.loadSwitchActivedVersion();
        $scope.loadSwitchActivatedStatus();
    }
  ]);
})(angular);
