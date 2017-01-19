angular.module('VocBuilder').factory('authIntercepior', function ($rootScope, $q, $cookieStore, $location){
	return{
		request: function (config){
			config.headers = config.headers || {};
			if ($cookieStore.get('token')) {
				config.headers.Authorization = 'Bearer' + $cookieStore.get('token');
			};
			return config;
		},
		responseError: function (response){
			if (response.status === 401) {
				$location.path('/login');
				$cookieStore.remove('token');
				return $q.reject(response);
			} else {
				return $q.reject(response);
			}
		}
	};
})
.factory('Auth', function ($http, $location, $cookieStore, $q){
	var currentUser = {};
	return {
		login: function (user, callback){
			var cb = callback || angular.noop;
			var deferred = $q.defer();
			$http.post('/auth/login', {
				email: user.email,
				password: user.password
			}).success(function (response){
				$cookieStore.put('token', response.body.token);
				currentUser = response.body.user;
				return cb(currentUser);
			}).error(function (err){
				this.logout();
				deferred.reject(err);
				return cb(err);
			}.bind(this));
			return deferred.promise;
		},

		logout: function (){
			$cookieStore.remove('token');
			currentUser = {};
		},

		createUser: function(user, callback){
			var cb = callback || angular.noop;
			$http.post('auth.signup', {
				username: user.username,
				email: user.email,
				password: user.password
			}).success(function (response){
				$cookieStore.put('token', response.body.token);
				currentUser = response.body.user;
				return cb(currentUser);
			}).error(function (err){
				this.logout();
				return cb(err);
			}.bind(this).$promise);
		},

		getToken: function(){
			return $cookieStore.get('token');
		}
	};
})