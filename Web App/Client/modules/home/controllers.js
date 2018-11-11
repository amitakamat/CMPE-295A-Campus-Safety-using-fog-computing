'use strict';
 
angular.module('Home')
angular.module('Authentication')
 
.controller('LogoutController',
    ['$scope', '$rootScope', '$location', 'AuthenticationService',
    function ($scope, $rootScope, $location, AuthenticationService) {
        // reset login status
        AuthenticationService.ClearCredentials();

        $scope.register = function () {
            $location.path("/login");
        };
    }])