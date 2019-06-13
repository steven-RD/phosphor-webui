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
    '$scope', '$window', 'APIUtils', 'dataService', '$location', '$route',
    '$anchorScroll', 'Constants', '$interval', '$q', '$timeout', '$interpolate', 'toastService',
    function(
        $scope, $window, APIUtils, dataService, $location, $route, $anchorScroll,
        Constants, $interval, $q, $timeout, $interpolate, toastService) {
        $scope.dataService = dataService;

        //Scroll to target anchor
        $scope.gotoAnchor = function() {
            $location.hash('upload');
            $anchorScroll();
        };

        // Judy add 20190612
        $scope.switchInfo = {switchActivedVersion: '', configurationFile: '',
                             toBeActiveVersion: '', type: '',
                             switchActivatedStatus: '',
                             switchUpdateStatus: '',
                             exist_toBeActiveVersion: false};
        $scope.firmwares = [];
        $scope.switchActiveVersion = '';
        //$scope.hostActiveVersion = '';
        $scope.display_error = false;
        $scope.activate_confirm = false;
        $scope.delete_image_id = '';
        $scope.delete_image_version = '';
        $scope.activate_image_id = '';
        $scope.activate_image_version = '';
        $scope.activate_image_type = '';
        $scope.priority_image_id = '';
        $scope.priority_image_version = '';
        $scope.priority_from = -1;
        $scope.priority_to = -1;
        $scope.confirm_priority = false;
        $scope.file_empty = true;
        $scope.uploading = false;
        $scope.updating = false; // Judy add
        $scope.upload_success = false;
        $scope.activate = {reboot: true};
        $scope.download_error_msg = '';
        $scope.download_success = false;

        var pollActivationTimer = undefined;
        var pollDownloadTimer = undefined;

        $scope.error = {modal_title: '', title: '', desc: '', type: 'warning'};

        $scope.activateImage = function(imageId, imageVersion, imageType) {
			$scope.activate_image_id = imageId;
			$scope.activate_image_version = imageVersion;
			$scope.activate_image_type = imageType;
			$scope.activate_confirm = true;
        };

        $scope.displayError = function(data) {
			$scope.error = data;
			$scope.display_error = true;
			console.log(data);
        };

        function waitForActive(imageId) {
			var deferred = $q.defer();
			var startTime = new Date();
			pollActivationTimer = $interval(function() {
            APIUtils.getActivation(imageId).then(
				function(state) {
					//@TODO: display an error message if image "Failed"
					if (((/\.Active$/).test(state.data)) ||
						((/\.Failed$/).test(state.data))) {
						$interval.cancel(pollActivationTimer);
						pollActivationTimer = undefined;
						deferred.resolve(state);
					}
				},
				function(error) {
					$interval.cancel(pollActivationTimer);
					pollActivationTimer = undefined;
					console.log(error);
					deferred.reject(error);
				});
				var now = new Date();
				if ((now.getTime() - startTime.getTime()) >=
				  Constants.TIMEOUT.ACTIVATION) {
					$interval.cancel(pollActivationTimer);
					pollActivationTimer = undefined;
					console.log('Time out activating image, ' + imageId);
					deferred.reject('Time out. Image did not activate in allotted time.');
				}
            }, Constants.POLL_INTERVALS.ACTIVATION);
			return deferred.promise;
        }

        $scope.activateConfirmed = function() {
            APIUtils.activateImage($scope.activate_image_id)
            .then(
                function(state) {  ///activate sucdess
                    $scope.loadFirmwares();
                    return state;
                },
                function(error) {  ///activate fail
                    $scope.displayError({
                        modal_title: 'Error during activation call',
                        title: 'Error during activation call',
                        desc: JSON.stringify(error.data),
                        type: 'Error'
                    });
                })
            .then(function(activationState) { ///wait For activate
                waitForActive($scope.activate_image_id)
                .then(
                    function(state) {
                        $scope.loadFirmwares();
                    },
                    function(error) {
                        $scope.displayError({
                            modal_title: 'Error during image activation',
                            title: 'Error during image activation',
                            desc: JSON.stringify(error.data),
                            type: 'Error'
                        });
                    })
                .then(function(state) {
                    if ($scope.activate.reboot &&
                       ($scope.activate_image_type == 'Switch')) {
                        $timeout(function() {
                        APIUtils.bmcReboot().then(
                            function(response) {},
                            function(error) {
                              $scope.displayError({
                                modal_title: 'Error during Switch reboot',
                                title: 'Error during Switch reboot',
                                desc: JSON.stringify(error.data),
                                type: 'Error'
                              });
                            });
                      }, 10000);
                    }
                });
            });
            $scope.activate_confirm = false;
        };

        $scope.upload = function() {
            if ($scope.file) {
                $scope.uploading = true;
                $scope.upload_success = false;
                APIUtils.uploadImage($scope.file)
                .then(
                    function(response) {
                        $scope.file = '';
                        $scope.uploading = false;
                        $scope.upload_success = true;
                        // APIUtils.updateImageStatus(0);    // initial set 0
                        // APIUtils.runImage(0);    // initial set 0
                        $scope.loadFirmwares();
                        $scope.loadSwitchUpdateStatus();
                        $scope.loadSwitchActivatedStatus();
                    },
                    function(error) {
                        $scope.uploading = false;
                        toastService.error("Upload image error");
                    }
                );
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
				    $scope.loadFirmwares();
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

        $scope.deleteImage = function(imageId, imageVersion) {
            $scope.delete_image_id = imageId;
            $scope.delete_image_version = imageVersion;
            $scope.confirm_delete = true;
        };

        $scope.confirmDeleteImage = function() {
            $scope.loading = true;
            APIUtils.deleteImage($scope.delete_image_id).then(function(response) {
                $scope.loading = false;
                if (response.status == 'error') {
                    $scope.displayError({
                        modal_title: response.data.description,
                        title: response.data.description,
                        desc: response.data.exception,
                        type: 'Error'
                    });
                } else {
                    $scope.loadFirmwares();
                }
            });
            $scope.confirm_delete = false;
        };

        $scope.fileNameChanged = function() {
            $scope.file_empty = false;
        };

        $scope.filters = {bmc: {imageType: 'BMC'}, Switch: {imageType: 'Host'}};

        $scope.loadFirmwares = function() {
            APIUtils.getFirmwares()
            .then(
                function(result) {
                    $scope.firmwares = result.data;
                    $scope.loadSwitchBeingActiveVersion();
                    $scope.loadSwitchActivedVersion();
                },
                function(error) {
                    console.log(error);
                });
        };

        $scope.loadSwitchBeingActiveVersion = function() {
            APIUtils.getSwitchBeingActiveVersion(function(version, type) {
                $scope.switchInfo.toBeActiveVersion = version;
                $scope.switchInfo.type = type;

                // if exist to be active version, exist_toBeActiveVersion true
                if (version != 'None'){
                    $scope.switchInfo.exist_toBeActiveVersion = true;
                }
                console.log($scope.switchInfo.exist_toBeActiveVersion);
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
            /*
                1. First set the value of imageid.
                2. Then set the status of update to 1, then firmware start to update.
                    if update status ok, the update status maybe success or fail.
                        if success, return 2:
                            Update switch BeingActiveVersion;
                            Update SwitchUpdateStatus.
                        if fail, return 3:
                            Update SwitchUpdateStatus.
            */
            $scope.activate_image_id = imageId;
            $scope.activate_image_version = imageVersion;
            $scope.activate_image_type = imageType;
            $scope.updating = true;

            // Check whether image has already been actived.
            APIUtils.getSwitchActivedVersion(function(fwVersion, confFile) {
                console.log('fwVersion == imageVersion');
                if (confFile != ""){
                    confFile = 'v' + confFile;
                }
                console.log(confFile);
                console.log(imageVersion);
                if (confFile == imageVersion){
                    toastService.error('This image has already been actived!');
                    return
                }
            },
            function(error) {
              console.log(error);
            });
            console.log("fwVersion");

            APIUtils.updateImage(imageId)
            .then(
                function(imageState) {    // update ImageId success
                    APIUtils.updateImageStatus(1)    // update process success
                    .then(
                        function(state){
                            $scope.updating = false;
                            APIUtils.getSwitchUpdateStatus(function(data, originalData) {
                                console.log("APIUtils.getSwitchUpdateStatus call")
                                console.log(data)
                                var updateStatus = data.toString();
                                if (updateStatus == '2'){    // 2 update status success
                                    $scope.loadSwitchBeingActiveVersion();
                                    $scope.loadSwitchUpdateStatus();
                                    toastService.success('Update image success');
                                    console.log('Update success');
                                    return state;
                                }
                                if (updateStatus == '3'){    // 3 update status fail
                                    $scope.loadSwitchUpdateStatus();
                                    toastService.error(imageId + ' update image fail, value 3');
                                }
                            },
                            function(error) {
                              console.log("Get switch update status error.");
                            });
                        },
                        function(error){    // update process error
                            $scope.updating = false;
                            $route.reload();
                            toastService.error('Error during update status process' + error);
                        }
                    )
                },
                function(error){    // update imageid error
                    toastService.error('Error during update imageid');
                }
            );
            console.log('updateImage $scope.updating');
            console.log($scope.updating);
        };

        $scope.runImage = function(imageId, imageVersion, imageType) {
            $scope.activate_image_id = imageId;
            $scope.activate_image_version = imageVersion;
            $scope.activate_image_type = imageType;
            $scope.activate_confirm = true;
        };

        $scope.runConfirmed = function() {
            APIUtils.runImage(1)
            .then(
                function(state) {    // active success
                    APIUtils.getSwitchActivatedStatus(function(data, originalData) {
                        var activatedStatus = data.toString();
                        if (activatedStatus == '2'){
                            APIUtils.deleteImage($scope.activate_image_id);    // delete image
                            $scope.loadFirmwares();
                            $scope.loadSwitchActivedVersion();
                            $scope.loadSwitchActivatedStatus();
                            $route.reload();
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
                function(error) {  // active fail
                    toastService.error('Error during run image.');
                });
            $scope.activate_confirm = false;
        };

        $scope.loadFirmwares();
        $scope.loadSwitchBeingActiveVersion();
        $scope.loadSwitchActivedVersion();
        $scope.loadSwitchUpdateStatus();
        $scope.loadSwitchActivatedStatus();
    }
  ]);
})(angular);
