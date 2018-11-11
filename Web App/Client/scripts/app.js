'use strict';

// declare modules
angular.module('Authentication', []);
angular.module('Home', []);

angular.module('BasicHttpAuthExample', [
    'Authentication',
    'Home',
    'ngRoute',
    'ngCookies'
])
 
.config(['$routeProvider', function ($routeProvider) {

    $routeProvider
        .when('/login', {
            controller: 'LoginController',
            templateUrl: 'modules/authentication/views/login.html',
            hideMenus: true
        })
 
        .when('/', {
            controller: 'HomeController',
            templateUrl: 'modules/authentication/views/home.html'
        })

        .when('/register', {
            controller: 'RegisterController',
            templateUrl: 'modules/authentication/views/register.html'
        })

        .when('/logout', {
            controller: 'LogoutController',
            templateUrl: 'modules/authentication/views/login.html',
            hideMenus: true
        })

        .when('/viewall', {
            controller: 'ViewController',
            templateUrl: 'modules/authentication/views/viewtables.html',
            hideMenus: true
        })

        .when('/newcriminal', {
            controller: 'NewCriminalController',
            templateUrl: 'modules/authentication/views/criminal.html',
            hideMenus: true
        })

        .when('/viewlogs', {
            controller: 'LogsController',
            templateUrl: 'modules/authentication/views/viewlogs.html',
            hideMenus: true
        })
 
        .otherwise({ redirectTo: '/login' });
}])
 
.run(['$rootScope', '$location', '$cookieStore', '$http',
    function ($rootScope, $location, $cookieStore, $http) {
        // keep user logged in after page refresh
        $rootScope.globals = $cookieStore.get('globals') || {};
        if ($rootScope.globals.currentUser) {
            $http.defaults.headers.common['Authorization'] = 'Basic ' + $rootScope.globals.currentUser.authdata; // jshint ignore:line
        }
 
        $rootScope.$on('$locationChangeStart', function (event, next, current) {
            // redirect to login page if not logged in
            if(!$rootScope.globals.currentUser) {
                if ($location.path() == '/register'){
                    $location.path('/register');
                }
                else{
                    $location.path('/login');
                }
            }
        });
    }]);