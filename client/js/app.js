'use strict';
var VocBuilder = angular.module('VocBuilder', ['ngCookies', 'ngResource', 'ngSanitize', 'ui.router', 'client', 'admin']);
VocBuilder.config(['$stateProvider', '$urlRouterProvider', '$locationProvider', '$httpProvider', function ($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider){
	$stateProvider.state('login', {
		url: '/login',
		templateUrl: 'views/login.html',
		controller: 'loginCtrl'
	})
	.state('signup', {
		url: '/signup',
		templateUrl: 'views/signup.html',
		controller: 'signupCtrl'
	})
	.state('recover', {
		url: 'views/resetPwd',
		templateUrl: 'views/recover.html',
		controller: 'recoverCtrl'
	});
	$urlRouterProvider.otherwise('/login');
	$locationProvider.html5Mode(true);
	$httpProvider.interceptors.push('authIntercepior');
}])
.controller('loginCtrl', function ($state, $scope, Auth){
	$scope.user = {};
	$scope.errors = {};
	$scope.login = function(){
		if (!$scope.user.email) {
			$scope.errors.other = 'Please enter your email.';
		} else if (! $scope.user.password) {
			$scope.errors.other = 'Please enter your password.';
		} else if (!$scope.user.email && !$scope.user.password) {
			$scope.errors.other = 'Please enter your email and password.';
		} else {
			Auth.login({
				email: $scope.user.email,
				password: $scope.user.password
			}).then(function (data){
				$scope.user = data;
				if ($scope.user.role == 'user') {
					$state.go('userIndex', {
						username: $scope.user.username
					});
				} else {
					$state.go('adminIndex', {
						username: $scope.user.username
					});
				};
			}).catch(function (err){
				alert(err.message);
			});
		};
	};
})
.controller('signupCtrl', function ($state, $scope, Auth){
	$scope.user = {};
	$scope.errors = {};
	$scope.register = function (){
		Auth.createUser({
			username: $scope.user.username,
			email: $scope.user.email,
			password: $scope.user.password
		}).then(function(){
			$state.go('userIndex', {
				username: $scope.user.username
			});
		}).catch(function (err){
			err = err.data;
			$scope.errors = {};
			angular.forEach(err.errors, function (error, field){
				form[field].$setValidity('mongoose', false);
				$scope.errors[field] = error.message;
			})
		});
	};
})
.controller('recoverCtrl', function ($state, $scope, Auth){
	$scope.email = "";
})
.controller('NavbarCtrl', function ($scope, $location, Auth){
	$scope.logout = function (){
		Auth.logout();
		$location.path('/login');
	};

	$scope.isActive = function (route) {
		return route === $location.path();
	};
})
.controller('mainCtrl', function ($rootScope){
	$rootScope.cancel = function ($event){
		$event.preventDefault();
		$event.stopPropagation();
	};
})
.run(['$state', function ($state){
	$state.go('login');
}]);