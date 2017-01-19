'use strict';
var client = angular.module('client', ['ngRoute', 'ui.router', 'ngAnimate', 'ngStorage', 'ngSanitize', 'ngResource', 'ui.utils', 'ui.bootstrap', 'toaster', 'cfp.loadingBar']);
client.config(['$stateProvider', '$locationProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider, $locationProvider){
	$stateProvider.state('userIndex', {
		url: '/:username',
		templateUrl: 'modules/user/views/userindex.html'
	})
	.state('userIndex.dashboard', {
        url: '/:username/index',
        templateUrl: 'modules/user/views/dashboard.html',
        controller: 'dashboardController'
    })
    .state('userindex.dashboard.all', {
        url: '/:username/dashboard',
        templateUrl: 'modules/user/views/all.html',
        controller: 'allPCtrl'
    })
    .state('userIndex.dashboard.showOne', {
        url: '/:username/dashboard/:id',
        templateUrl: 'modules/user/views/showOne.html',
        controller: 'showOneCtrl'
    })
    .state('userIndex.cw', {
        url: '/:username/wi',
        templateUrl: 'modules/user/views/dashboard.html',
        controller: 'wordCtrl'
    })
    .state('userIndex.cw.all', {
        url: '/:username/words',
        templateUrl: 'modules/user/views/words.html',
        controller: 'word1Ctrl'
    })
    .state('userIndex.cw.showOne', {
        url: '/:username/words/:id',
        templateUrl: 'modules/user/views/oneword.html',
        controller: 'oneWordCtrl'
    })
    .state('userIndex.cw.edit', {
        url: '/:username/words/:id/edit',
        templateUrl: 'modules/user/views/editword.html',
        controller: 'editwordCtrl'
    })
    .state('userIndex.cw.add', {
        url: '/:username/words/newword',
        templateUrl: 'modules/user/views/newword.html',
        controller: 'newwordCtrl'
    })
    .state('userIndex.cs', {
        url: '/:username/si',
        templateUrl: 'modules/user/views/dashboard.html',
        controller: 'sentenceCtrl'
    })
    .state('userIndex.cs.all', {
        url: '/:username/sentences',
        templateUrl: 'modules/user/views/sentenses.html',
        controller: 'sentence1Ctrl'
    })
    .state('userIndex.cs.showOne', {
        url: '/:username/sentences/:id',
        templateUrl: 'modules/user/views/oneSentense.html',
        controller: 'oneSentenceCtrl'
    })
    .state('userIndex.cs.edit', {
        url: '/:username/sentences/:id/edit',
        templateUrl: 'modules/user/views/editsentence.html',
        controller: 'editsentenceCtrl'
    })
    .state('userIndex.cs.add', {
        url: '/:username/sentences/newsentence',
        templateUrl: 'modules/user/views/newsentense.html',
        controller: 'newsentenceCtrl'
    })
    .state('userIndex.settings', {
        url: '/:username/settings',
        templateUrl: 'modules/user/views/dashboard.html',
        controller: 'settingCtrl'
    })
    .state('userIndex.settings.cp', {
        url: '/:username/changePwd',
        templateUrl: 'modules/user/views/changePassword.html',
        controller: 'changePasswordCtrl'
    })
    .state('userIndex.setting.pi', {
        url: '/:username/userInfo',
        templateUrl: 'modules/user/views/personalInfo.html',
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