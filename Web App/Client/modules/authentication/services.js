'use strict';
angular.module('Authentication')

 
.factory('Service',
    ['Base64', '$http', '$cookieStore', '$rootScope', '$timeout',
    function (Base64, $http, $cookieStore, $rootScope, $timeout) {
        var service = {};
        var baseURL = "http://localhost:8080/v1/"; 
        var currentRecord = undefined;

        service.Login = function (username, password, callback) {

            /* Dummy authentication for testing, uses $timeout to simulate api call
             ----------------------------------------------*/
           /* $timeout(function(){
                var response = { success: username === 'test' && password === 'test' };
                if(!response.success) {
                    response.message = 'Username or password is incorrect';
                }
                callback(response);
            }, 1000);*/


            /* Use this for real authentication
             ----------------------------------------------*/
            $http.post(baseURL + 'user/login', { username: username, password: password })
                .then(function (response) {
                    if(response.data.statuscode == 0){
                        response.success = true;
                        callback(response);
                    }
                    else if(response.data.statuscode == 1){
                        response.success = false;
                        response.message = 'Username or password is incorrect';
                        callback(response);
                    }
                    else if(response.data.statuscode == 2){
                        response.success = false;
                        response.message = 'User does not exist';
                        callback(response);
                    } 
                }).catch(function (error) {
                    console.log(error);
                    response.success = false
                    response.message = 'Error in login. Please check your connection and try again.';
                    callback(response);
                });

        };

        service.Register = function(email, username, password, callback){
            /*$timeout(function(){
                var response = { success: username === 'test' && password === 'test' };
                if(!response.success) {
                    response.message = 'Username or password is incorrect';
                }
                callback(response);
            }, 1000);*/

            $http.post(baseURL + 'user/', { email: email, username: username, password: password })
                .then(function (response) {
                    if(response.data.statuscode == 0){
                        response.success = true;
                        callback(response);
                    }
                    if(response.data.statuscode == 1 || response.data.statuscode == 2){
                        response.success = false;
                        response.message = response.data.message;
                        callback(response);
                    } 
                }).catch(function (error) {
                    console.log(error);
                    response.success = false
                    response.message = 'Error in sign up. Please check your connection and try again.';
                    callback(response);
                });
        };
 
        service.SetCredentials = function (username, password) {
            var authdata = Base64.encode(username + ':' + password);
 
            $rootScope.globals = {
                currentUser: {
                    username: username,
                    authdata: authdata
                }
            };
            $rootScope.isLoggedIn = true;
 
            $http.defaults.headers.common['Authorization'] = 'Basic ' + authdata; // jshint ignore:line
            $cookieStore.put('globals', $rootScope.globals);
        };
 
        service.ClearCredentials = function () {
            $rootScope.globals = {};
            $rootScope.isLoggedIn = false;
            $cookieStore.remove('globals');
            $http.defaults.headers.common.Authorization = 'Basic ';
        };

        service.NewCriminal = function (firstname, lastname, dob, ethnicity, address, sex, contact, height, weight, offences, data, callback ){
            var data = {firstname : firstname, lastname: lastname, DOB: dob, ethnicity: ethnicity, address: address, sex: sex, phone: contact, height: height, 
                    weight: weight, offences: offences, imageData: data}
            $http.post(baseURL + 'criminal/', data)
                .then(function (response) {
                    if(response.data.statuscode == 0){
                        response.success = true;
                        callback(response);
                    }
                    if(response.data.statuscode == 1 || response.data.statuscode == 2){
                        response.success = false;
                        response.message = response.data.message;
                        callback(response);
                    } 
                }).catch(function (response) {
                    console.log(response);
                    response.success = false
                    response.message = 'Error in creating record. Please check your connection and try again.';
                    callback(response);
                });
        };

        service.UpdateCriminal = function (firstname, lastname, dob, ethnicity, address, sex, contact, height, weight, offences, data, callback ){
            var data = {firstname : firstname, lastname: lastname, DOB: dob, ethnicity: ethnicity, address: address, sex: sex, phone: contact, height: height, 
                    weight: weight, offences: offences, imageData: data}
            $http.put(baseURL + 'criminal/' + $rootScope.criminal._id, data)
                .then(function (response) {
                    if(response.data.statuscode == 0){
                        response.success = true;
                        callback(response);
                    }
                    if(response.data.statuscode == 1 || response.data.statuscode == 2){
                        response.success = false;
                        response.message = response.data.message;
                        callback(response);
                    } 
                }).catch(function (response) {
                    console.log(response);
                    response.success = false
                    response.message = 'Error in creating record. Please check your connection and try again.';
                    callback(response);
                });
        };

        service.GetCriminals = function (callback){
            $http.get(baseURL + 'criminals/')
                .then(function (response) {
                    if(response.data.statuscode == 0){
                        response.success = true;
                        response.result = response.data.result;
                        callback(response);
                    }
                    else{
                        response.success = false;
                        response.message = response.data.message;
                        callback(response);
                    } 
                }).catch(function (response) {
                    console.log(response);
                    response.success = false
                    response.message = 'Error in fetching criminal records. Please check your connection and try again.';
                    callback(response);
                });
        };

        service.GetLogs = function (callback){
            $http.get(baseURL + 'logs/')
                .then(function (response) {
                    if(response.data.statuscode == 0){
                        response.success = true;
                        response.result = response.data.result;
                        callback(response);
                    }
                    else{
                        response.success = false;
                        response.message = response.data.message;
                        callback(response);
                    } 
                }).catch(function (response) {
                    console.log(response);
                    response.success = false
                    response.message = 'Error in fetching criminal records. Please check your connection and try again.';
                    callback(response);
                });
        };
        service.GetAlertDetails = function (id, callback){
            //callback("Details");
            $http.get(baseURL + 'logs/' + id)
                .then(function (response) {
                    if(response.data.statuscode == 0){
                        response.success = true;
                        response.result = response.data.result;
                        callback(response);
                    }
                    else{
                        response.success = false;
                        response.message = response.data.message;
                        callback(response);
                    } 
                }).catch(function (response) {
                    console.log(response);
                    response.success = false
                    response.message = 'Error in fetching alert details. Please check your connection and try again.';
                    callback(response);
                });
        };

        service.RemoveCriminal = function (id, callback){
            //callback("Details");
            $http.delete(baseURL + 'criminal/' + id)
                .then(function (response) {
                    if(response.data.statuscode == 0){
                        response.success = true;
                        response.result = response.data.message;
                        callback(response);
                    }
                    else{
                        response.success = false;
                        response.message = response.data.message;
                        callback(response);
                    } 
                }).catch(function (response) {
                    console.log(response);
                    response.success = false
                    response.message = 'Error in deleting criminal record. Please check your connection and try again.';
                    callback(response);
                });
        }

        service.GetCriminalDetails = function (id, callback){
            //callback("Details");
            $http.get(baseURL + 'criminal/' + id)
                .then(function (response) {
                    if(response.data.statuscode == 0){
                        response.success = true;
                        response.result = response.data.result;
                        callback(response);
                    }
                    else{
                        response.success = false;
                        response.message = response.data.message;
                        callback(response);
                    } 
                }).catch(function (response) {
                    console.log(response);
                    response.success = false
                    response.message = 'Error in fetching criminal details. Please check your connection and try again.';
                    callback(response);
                });
        }
 
        return service;
    }])
 
.factory('Base64', function () {
    /* jshint ignore:start */
 
    var keyStr = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
 
    return {
        encode: function (input) {
            var output = "";
            var chr1, chr2, chr3 = "";
            var enc1, enc2, enc3, enc4 = "";
            var i = 0;
 
            do {
                chr1 = input.charCodeAt(i++);
                chr2 = input.charCodeAt(i++);
                chr3 = input.charCodeAt(i++);
 
                enc1 = chr1 >> 2;
                enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
                enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
                enc4 = chr3 & 63;
 
                if (isNaN(chr2)) {
                    enc3 = enc4 = 64;
                } else if (isNaN(chr3)) {
                    enc4 = 64;
                }
 
                output = output +
                    keyStr.charAt(enc1) +
                    keyStr.charAt(enc2) +
                    keyStr.charAt(enc3) +
                    keyStr.charAt(enc4);
                chr1 = chr2 = chr3 = "";
                enc1 = enc2 = enc3 = enc4 = "";
            } while (i < input.length);
 
            return output;
        },
 
        decode: function (input) {
            var output = "";
            var chr1, chr2, chr3 = "";
            var enc1, enc2, enc3, enc4 = "";
            var i = 0;
 
            // remove all characters that are not A-Z, a-z, 0-9, +, /, or =
            var base64test = /[^A-Za-z0-9\+\/\=]/g;
            if (base64test.exec(input)) {
                window.alert("There were invalid base64 characters in the input text.\n" +
                    "Valid base64 characters are A-Z, a-z, 0-9, '+', '/',and '='\n" +
                    "Expect errors in decoding.");
            }
            input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
 
            do {
                enc1 = keyStr.indexOf(input.charAt(i++));
                enc2 = keyStr.indexOf(input.charAt(i++));
                enc3 = keyStr.indexOf(input.charAt(i++));
                enc4 = keyStr.indexOf(input.charAt(i++));
 
                chr1 = (enc1 << 2) | (enc2 >> 4);
                chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
                chr3 = ((enc3 & 3) << 6) | enc4;
 
                output = output + String.fromCharCode(chr1);
 
                if (enc3 != 64) {
                    output = output + String.fromCharCode(chr2);
                }
                if (enc4 != 64) {
                    output = output + String.fromCharCode(chr3);
                }
 
                chr1 = chr2 = chr3 = "";
                enc1 = enc2 = enc3 = enc4 = "";
 
            } while (i < input.length);
 
            return output;
        }
    };
 
    /* jshint ignore:end */
});