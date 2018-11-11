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
    ['$scope', '$rootScope', '$location', 'Service',
    function ($scope, $rootScope, $location, Service) {
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
              $rootScope.criminal.DOB = new Date($rootScope.criminal.DOB);
              $location.path("/newcriminal");
          })  
        };

        $scope.new = function () {
            //$location.path('/');
            $rootScope.criminal = undefined;
            $location.path("/newcriminal");
        };
    }])
    .controller('NewCriminalController',
    ['$scope', '$rootScope', '$location', 'Service',
    function ($scope, $rootScope, $location, Service) {
        // reset login status

        $scope.createrecord = function () {
            if($rootScope.criminal == undefined){
                Service.NewCriminal($scope.criminal.firstname, $scope.criminal.lastname, $scope.criminal.DOB, $scope.criminal.ethinicity, 
                    $scope.criminal.address, $scope.criminal.sex, $scope.criminal.contact, $scope.criminal.height, $scope.criminal.weight, 
                    $scope.criminal.offences, function(response) {
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
                Service.UpdateCriminal($scope.criminal.firstname, $scope.criminal.lastname, $scope.criminal.DOB, $scope.criminal.ethinicity, 
                $scope.criminal.address, $scope.criminal.sex, $scope.criminal.contact, $scope.criminal.height, $scope.criminal.weight, 
                $scope.criminal.offences, function(response) {
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
            $location.path("/viewall");
        };

    }]);