'use strict';
 
angular.module('ui.bootstrap.demo', ['ngAnimate', 'ngSanitize', 'ui.bootstrap']);
angular.module('Authentication')
 
.controller('LoginController',
    ['$scope', '$rootScope', '$location', 'Service',
    function ($scope, $rootScope, $location, Service) {
        // reset login status
        Service.ClearCredentials();
 
        $scope.login = function () {
            $scope.dataLoading = true;
            Service.Login($scope.username, $scope.password, function(response) {
                if(response.success) {
                    Service.SetCredentials($scope.username, $scope.password);
                    $location.path('/');
                } else {
                    $scope.error = response.message;
                    $scope.dataLoading = false;
                }
            });
        };

        $scope.register = function () {
            $location.path("/register");
        };
    }])
    .controller('RegisterController',
    ['$scope', '$rootScope', '$location', 'Service',
    function ($scope, $rootScope, $location, Service) {
        // reset login status
        Service.ClearCredentials();
 
        $scope.register = function () {
            $scope.dataLoading = true;
            if($scope.password != $scope.cpassword){
                $scope.error = "Passwords do not match";
                $scope.dataLoading = false;
                return;
            }
            Service.Register($scope.email, $scope.username, $scope.password, function(response) {
                if(response.success) {
                    Service.SetCredentials($scope.username, $scope.password);
                    $location.path('/');
                } else {
                    $scope.error = response.message;
                    $scope.dataLoading = false;
                }
            });
        };
    }])
    .controller('LogoutController',
    ['$scope', '$rootScope', '$location', 'Service',
    function ($scope, $rootScope, $location, Service) {
        // reset login status

        $scope.logout = function () {
            Service.ClearCredentials();
            //$location.path('/');
            $location.path("/login");
        };
    }])
    .controller('HomeController',
    ['$scope', '$rootScope', '$location', 'Service',
    function ($scope, $rootScope, $location, Service) {
        // reset login status

        $scope.logout = function () {
            Service.ClearCredentials();
            //$location.path('/');
            $location.path("/login");
        };

        $scope.viewCriminals = function () {
            $location.path("/viewall");
        };

        $scope.viewLogs = function () {
            $location.path("/viewlogs");
        };

    }])
    .controller('ViewController',
    ['$scope', '$rootScope', '$location','$route', 'Service',
    function ($scope, $rootScope, $location, $route, Service) {
        // reset login status

        Service.GetCriminals(function(response) {
            if(response.success) {
                $scope.items = response.result
            } else {
                $scope.error = response.message;
                $scope.dataLoading = false;
            }
        });

        $scope.logout = function () {
            Service.ClearCredentials();
            //$location.path('/');
            $location.path("/login");
        };

        $scope.recordedit = function() {
          Service.GetCriminalDetails(event.target.id, function(response){
              console.log(response.data.result[0]);
              $rootScope.criminal = response.data.result[0];
              $rootScope.isNewCriminal = false;
              $rootScope.criminal.DOB = new Date($rootScope.criminal.DOB);
              $location.path("/newcriminal");
          })  
        };

        $scope.recorddelete = function() {
            Service.RemoveCriminal(event.target.id, function(response){
                console.log(response.data.message);
                alert(response.data.message);
                $route.reload();
            })  
        };

        $scope.new = function () {
            //$location.path('/');
            $rootScope.criminal = undefined;
            $rootScope.isNewCriminal = true;
            $location.path("/newcriminal");
        };

        $scope.previewFile = function () {
            var preview = document.getElementById('criminalimage');
            var file    = document.getElementById('uploadphoto').files[0];
            var reader  = new FileReader();

            reader.addEventListener("load", function () {
                preview.src = reader.result;
            }, false);

            if (file) {
                console.log(reader.readAsBinaryString(file));
            }
        };
    }])
    .controller('NewCriminalController',
    ['$scope', '$rootScope', '$location', 'Service',
    function ($scope, $rootScope, $location, Service) {
        // reset login status
        $scope.imageData = "";
        if($rootScope.criminal != undefined){
            var preview = document.getElementById('criminalimage');
            preview.src = "data:image/png;base64," + $rootScope.criminal.imageData;
            $scope.imageData = $rootScope.criminal.imageData;
        }
        $scope.createrecord = function () {
            if($scope.criminal.firstname == undefined)
                $scope.criminal.firstname = "";   
            if($scope.criminal.lastname  == undefined)
                $scope.criminal.lastname = "";
            if($scope.criminal.DOB == undefined)
                $scope.criminal.DOB = ""; 
            if($scope.criminal.Ethnicity == undefined)
                $scope.criminal.Ethnicity = "";
            if($scope.criminal.Address == undefined)
                $scope.criminal.Address = "";
            if($scope.criminal.Sex == undefined)
                $scope.criminal.Sex = "";
            if($scope.criminal.Contact == undefined)
                $scope.criminal.Contact = "";
            if($scope.criminal.Height == undefined)
                $scope.criminal.Height == "";
            if($scope.criminal.Weight == undefined) 
                $scope.criminal.Weight = "";
            if($scope.criminal.Offence == undefined)
                $scope.criminal.Offence = "";
            if($scope.imageData == undefined)
                $scope.imageData == "";
            if($rootScope.criminal == undefined){
                Service.NewCriminal($scope.criminal.firstname, $scope.criminal.lastname, $scope.criminal.DOB, $scope.criminal.Ethnicity, 
                    $scope.criminal.Address, $scope.criminal.Sex, $scope.criminal.Contact, $scope.criminal.Height, $scope.criminal.Weight, 
                    $scope.criminal.Offence, $scope.imageData, function(response) {
                    if(response.success) {
                        alert("Record successfully created");
                        $rootScope.criminal = undefined;
                        $location.path("/viewall");
                    } else {
                        $scope.error = response.message;
                        $scope.dataLoading = false;
                    }
                });
            }
            else{
                Service.UpdateCriminal($scope.criminal.firstname, $scope.criminal.lastname, $scope.criminal.DOB, $scope.criminal.Ethnicity, 
                    $scope.criminal.Address, $scope.criminal.Sex, $scope.criminal.Contact, $scope.criminal.Height, $scope.criminal.Weight, 
                    $scope.criminal.Offence, $scope.imageData, function(response) {
                    if(response.success) {
                        alert("Record successfully updated");
                        $rootScope.criminal = undefined;
                        $location.path("/viewall");
                    } else {
                        $scope.error = response.message;
                        $scope.dataLoading = false;
                    }
                });
            }
        };

        $scope.logout = function () {
            Service.ClearCredentials();
            //$location.path('/');
            $location.path("/login");
        };

        $scope.cancel = function () {
            $rootScope.criminal = undefined;
            $location.path("/viewall");
        };

        $scope.previewFile = function () {
            var preview = document.getElementById('criminalimage');
            var file    = document.getElementById('uploadphoto').files[0];
            var reader  = new FileReader();

            reader.addEventListener("load", function () {
                preview.src = reader.result;
                var data = reader.result.split(",")[1];
                $scope.imageData = data;
            }, false);

            if (file) {
                reader.readAsDataURL(file);
            }
        };

    }])
    .controller('LogsController',
    ['$scope', '$rootScope', '$location', 'Service',
    function ($scope, $rootScope, $location, Service) {
        // reset login status

        $scope.logout = function () {
            Service.ClearCredentials();
            $location.path("/login");
        };

        $scope.cancel = function () {
            $rootScope.alert = undefined;
            $location.path("/viewlogs");
        };

        $scope.viewalert = function() {
            console.log(event.target.id);
            Service.GetAlertDetails(event.target.id, function(response){
                console.log(response.data.result[0]);
                $rootScope.alert = response.data.result[0];
                if($rootScope.alert.detectedFaces.length == 0){
                    $rootScope.alert.detectedFaces = "No Criminals detected";
                }
                if($rootScope.alert.detectedEmotions.length == 0){
                    $rootScope.alert.detectedEmotions = "No violent emotions detected";
                }
                if($rootScope.alert.detectedWeapons.length == 0){
                    $rootScope.alert.detectedWeapons = "No weapons detected";
                }
                $rootScope.alert.timestamp = $rootScope.alert.timestamp.split('T')[0];
                $location.path("/alert");
            })  
          };

        Service.GetLogs(function(response) {
            if(response.success) {
                $scope.items = response.result;
                console.log(response.result);
            } else {
                $scope.error = response.message;
                $scope.dataLoading = false;
            }
        });

    }])
    .controller('AlertsController',
    ['$scope', '$rootScope', '$location', 'Service',
    function ($scope, $rootScope, $location, Service) {
        // reset login status

        if($rootScope.alert != undefined){
            var preview = document.getElementById('alertimage');
            preview.src = "data:image/png;base64," + $rootScope.alert.imageData;
        }

        $scope.logout = function () {
            Service.ClearCredentials();
            $location.path("/login");
        };

        $scope.cancel = function () {
            $location.path("/viewlogs");
        };

        /*Service.GetLogs(function(response) {
            if(response.success) {
                $scope.items = response.result;
                console.log(response.result);
            } else {
                $scope.error = response.message;
                $scope.dataLoading = false;
            }
        });*/

    }])
    .controller('NavMenuController',
    ['$scope', '$rootScope', '$location', 'Service',
    function ($scope, $rootScope, $location, Service) {
        $scope.logout = function () {
            Service.ClearCredentials();
            //$location.path('/');
            $location.path("/login");
        };

        $scope.viewCriminals = function () {
            $location.path("/viewall");
        };

        $scope.viewLogs = function () {
            $location.path("/viewlogs");
        };

        $scope.viewHome = function () {
            $location.path("/");
        };
    }]);