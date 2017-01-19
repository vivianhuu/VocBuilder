'use strict';
var admin = angular.module('admin', ['ngRoute', 'ui.router', 'ngAnimate', 'ngStorage', 'ngSanitize', 'ngResource', 'ui.utils', 'ui.bootstrap', 'toaster', 'cfp.loadingBar']);
admin.config(['$stateProvider', '$urlRouterProvider', '$locationProvider', function ($stateProvider, $locationProvider, $urlRouterProvider){
	$stateProvider.state('adminIndex', {
		url: '/:username',
		templateUrl: 'modules/admin/views/adminindex.html'
	})
	.state('adminIndex.dashboard', {
        url: '/:username/index',
        templateUrl: 'modules/admin/views/dashboard.html',
        controller: 'AdCtrl'
    })
    .state('adminIndex.dashboard.all', {
        url: '/:username/dashboard',
        templateUrl: 'modules/admin/views/dashboard1.html',
        controller: 'AdallCtrl'
    })
    .state('adminIndex.dashboard.singlePost', {
        url: '/:username/dashboard/:id',
        templateUrl: 'modules/admin/views/singlePost.html',
        controller: 'singlePostCtrl'
    })
    .state('adminIndex.dashboard.editPost', {
        url: '/:username/dashboard/:id/edit',
        templateUrl: 'modules/admin/views/editPost.html',
        controller: 'editPostCtrl'
    })
    .state('adminIndex.newPost', {
        url: '/:username/dashboard/newPost',
        templateUrl: 'modules/admin/views/newPost.html',
        controller: 'newPostCtrl'
    })
    .state('adminIndex.users', {
        url: '/:username/ui',
        templateUrl: 'modules/admin/views/dashboard.html',
        controller: 'auCtrl'
    })
    .state('adminIndex.users.all', {
        url: '/:username/allusers',
        templateUrl: 'modules/admin/views/alluser.html',
        controller: 'au1Ctrl'
    })
    .state('adminIndex.users.oneuser', {
        url: '/:username/allusers/:id',
        templateUrl: 'modules/admin/views/oneuser.html',
        controller: 'oneuserCtrl'
    })
    .state('adminIndex.users.newuser', {
        url: '/:username/allusers/newuser',
        templateUrl: 'modules/admin/views/newuser.html',
        controller: 'newuserCtrl'
    })
    .state('adminIndex.settings', {
        url: '/:username/settings',
        templateUrl: 'modules/admin/views/dashboard.html',
        controller: 'settingCtrl'
    })
    .state('adminIndex.settings.cp', {
        url: '/:username/changePwd',
        templateUrl: 'modules/admin/views/changePassword.html',
        controller: 'changePasswordCtrl'
    })
    .state('adminIndex.settings.pi', {
        url: '/:username/userInfo',
        templateUrl: 'modules/admin/views/personalInfo.html',
        controller: 'personalInfoCtrl'
    });
}])
.config(['cfpLoadingBarProvider', function (cfpLoadingBarProvider){
    cfpLoadingBarProvider.includeBar = true;
    cfpLoadingBarProvider.includeSpinner = false;
    cfpLoadingBarProvider.latencyThreshold = 500;
    cfpLoadingBarProvider.parentSelector = '.app-container > header';
}])
.run(['$rootScope', '$timeout', 'cfpLoadingBar', function ($rootScope, $timeout, cfpLoadingBar){
    var latency;
    $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams){
        if (document.querySelector('.app-container > section')) {
            latency = $timeout(function(){
                cfpLoadingBar.start();
            }, 50);
        };
    });

    $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams){
        event.targetScope.$watch('$viewContentLoaded', function(){
            $timeout.cancel(latency);
            cfpLoadingBar.complete();
        });
    });
}]);