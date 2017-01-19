'use strict';

angular.module('admin').controller('AdCtrl', function ($scope, $state, $stateParams){
	$scope.username = $stateParams.username;
	$state.go('adminIndex.dashboard.all', {
		username: $scope.username
	});
})
.controller('AdallCtrl', function ($scope, $http, $state, $stateParams, confirmService) {
	$scope.username = $stateParams.username;
	$http.get('/:username/dashboard').then(function (response){
		if (response.status == 200) {
      		$scope.things = response.body;
      		for(var i = 1; i<= $scope.things.length; i++){
      			$scope.things[i-1].num = i;
      			$scope.things[i-1].checked = false;
      		};
      	} else {
      		$scope.message = response.status + response.body;
      	};
    });
    var errMessage = "";
	var fp = "";
	$scope.remove = function(){
		var dp =[];
		$scope.things.forEach(function (item){
			if (item.checked) {
				dp.push(item);
			};
		});
		if (dp) {
			if (confirmService.showPopup('Are you sure to delete selected items?')) {
				$scope.things.forEach(function (item){
					if (item.checked) {
						$http.delete('/:username/dashboard', {params: {id: item._id}}).then(function (response){
							if (response.status == 404) {
								fp += item.title + "/n";
							} else if (response.status == 500) {
								errMessage = "Something Wrong with server, please try again.";
							};
						});
					};
				});
			};
		} else {
			alert('Please selected items to delete!');
		};
		if (fp) {
			alert("Fail to find the posts: /n" + fp);
			$state.transitionTo($state.current, $stateParams, {
				reload: true,
				inherit: false,
				notify: true
			});
		} else if (errMessage) {
			alert(errMessage);
		} else {
			alert("Success to delete selected posts.");
			$state.transitionTo($state.current, $stateParams, {
				reload: true,
				inherit: false,
				notify: true
			});
		};
	};
})
.controller('singlePostCtrl', function ($scope, $http, $state, $stateParams, confirmService){
	$scope.username = $stateParams.username;
	$scope.singlePost = {};
	$scope.contents = [];	
	// var reatts = [];
	$http.get('/:username/dashboard/:id').then(function (response){
		if (response.statusCode == 200) {;
			$scope.singlePost = response.body;
			// if ($scope.singlePost.tag == 'word') {
			// 	var contents = $singlePost.contents;
			// 	for(var n = 0; n<contents.length; n++){
			// 		var single =[];
			// 		for(var m = 0; m<contents[n].atts.length; m++){
			// 			single[m].cont = contents[n].atts[m];
			// 		};
			// 		$scope.contents[n].atts = single; 
			// 		$scope.contents[n].word = contents[n].word;
			// 		// $scope.contents[n].sample = contents[n].sample;
			// 	};
			// } else {
			// 	$scope.sentence.con = $scope.singlePost.contents;
			// };
		} else {
			alert('Something wrong with the sever, please try again!');
			$state.transitionTo($state.current, $stateParams, {
				reload: true,
				inherit: false,
				notify: true
			});
		};
	});
	// $scope.removeOne = function(item){
	// 	if (confirmService.showPopup('Are you sure to delete it?')) {
	// 		for(var j = 0; j<$scope.singlePost.contents.length; j++){
	// 			if ($scope.singlePost.contents[j].word == item.word) {
	// 				$scope.singlePost.contents.splice(j, 1);
	// 			};
	// 		};
	// 		$state.transitionTo($state.current, $stateParams, {
	// 			reload: true,
	// 			inherit: false,
	// 			notify: true
	// 		});
	// 	};
	// };
	// $scope.removeatt = function(item){
	// 	if (confirmService.showPopup('Are you sure to delete it?')) {
	// 		 reatts.push(item.cont);
	// 		 item.show = false;
	// 	};
	// };
	
	$scope.removeAll = function (){
		if (confirmService.showPopup('Really delete this post?')) {
			$http.delete('/:username/dashboard').then(function (response){
				if (response.status == 204) {
					alert('Successfully delete the selected post.');
					$state.go('adminIndex.dashboard.all', {
						username: username
					});
				} else {
					alert('Something wrong, please try again.');
				};
			});
		};
	};
})
.controller('editPostCtrl', function ($scope, $http, $state, $stateParams){
	$scope.username = $stateParams.username;
	$http.get('/:username/dashboard/:id/edit').then(function (response){
		if (response.statusCode == 200) {;
			$scope.singlePost = response.body;
		} else {
			alert('Something wrong with the sever, please try again!');
			$state.transitionTo($state.current, $stateParams, {
				reload: true,
				inherit: false,
				notify: true
			});
		};
	});
	$scope.update = function (){
		// for(var a = 0; a<reatts.length; a++){
		// 	for(var b = 0; b<item.atts.length; b++){
		// 		if (item.atts[b].cont == reatts[a]) {
		// 			item.atts.splice(b,1);
		// 		};
		// 	};
		// };
		// var al =[];
		// for(var q=0; q<item.atts.length; q++){
		// 	al[q] = item.atts[q].cont;
		// };
		// for(var i = 0; i<$scope.singlePost.contents.length; i++){
		// 	if ($scope.singlePost.contents[i].word == item.word) {
		// 		$scope.singlePost.contents[i].atts = al;
		// 	};
		// };
		$http.post('/:username/dashboard/:id/edit', $scope.singlePost).then(function (response){
			if (response.status == 200) {
				$scope.singlePost = response.body;
				alert('Successfully update the selected item.');
				$state.go('adminIndex.dashboard.singlePost', {
					username: username,
					id: $scope.singlePost.id
				});
			} else {
				alert('Something wrong, please try again.');
				$state.transitionTo($state.current, $stateParams, {
					reload: true,
					inherit: false,
					notify: true
				});
			};
		});
	};
	// $scope.updateS = function (){
	// 	$http.post('/:username/dashboard/:id/edit', $scope.singlePost).then(function (response){
	// 		if (response.status == 200) {
	// 			$scope.singlePost
	// 			alert('Successfully update the selected item.');
	// 			$state.transitionTo($state.current, $stateParams, {
	// 				reload: true,
	// 				inherit: false,
	// 				notify: true
	// 			});
	// 		} else {
	// 			alert('Something wrong, please try again.');
	// 		};
	// 	});
	// };
})
.controller('newPostCtrl', function ($scope, $http, $state, $stateParams){
	$scope.username = $stateParams.username;
	$scope.np = {};
	$scope.np.contents = [];
	$scope.nw = {};
	$scope.nw.atts = [];
	$scope.nws = [];
	$scope.more = function(){
		$scope.nw.atts.push($scope.att);
		$scope.att = "";
	};
	$scope.morew = function(){
		$scope.nws.push($scope.nw);
		$scope.nw = {};
	};
	$scope.removeAtt = function(item){
		if (confirmService.showPopup('Are you sure to delete it?')) {
			for(var i = 0; i<$scope.nw.atts.length; i++){
				if ($scope.nw.atts[i] == item) {
					$scope.nw.atts.splice(i, 1);
				};
			};
		};
	};
	$scope.addnpw = function(){
		$scope.np.author = $scope.username;
		for(var i = 0; i<$scope.nws.length; i++){
			$scope.np.contents.push($scope.nws[i]);
		};
		$http.post('/:username/dashboard/newpost', $scope.np).then(function (response){
			if (response.status == 201) {
				alert("Add a new post successfully!");
				$state.go('adminIndex.dashboard', {
					username: $scope.username
				});
			} else {
				alert("Something wrong! Please try again.");
			};
		});
	};
	$scope.addnps = function(){
		$scope.np.author = $scope.username;
		$scope.np.contents.push($scope.ns);
		$http.post('/:username/dashboard/newpost', $scope.np).then(function (response){
			if (response.status == 201) {
				alert("Add a new post successfully!");
				$state.go('adminIndex.dashboard', {
					username: $scope.username
				});
			} else {
				alert("Something wrong! Please try again.");
			};
		});
	};
})
.controller('auCtrl', function ($scope, $state, $stateParams){
	$scope.username = $stateParams.username;
	$state.go('adminIndex.users.all', {
		username: $scope.username
	});
})
.controller('au1Ctrl', function ($scope, $http, $state, $stateParams){
	$scope.username = username;
	$http.get('/:username/allusers').then(function (response){
		if (response.status == 200) {
			$scope.users = response.body;
			for(var i = 0; i<$scope.users.length; i++){
				$scope.users[i].num = i+1;
			};
		} else {
			alert('Something wrong, please try again.');
			$state.transitionTo($state.current, $stateParams, {
				reload: true,
				inherit: false,
				notify: true
			});
		};
	});
})
.controller('oneuserCtrl', function ($scope, $http, $state, $stateParams){
	$scope.username = $stateParams.username;
	$scope.user = {};
	$http.get('/:username/allusers/:id').then(function (response){
		if (response.status == 200) {
			$scope.user = response.body;
		} else {
			alert('Something wrong, please try again.');
			$state.transitionTo($state.current, $stateParams, {
				reload: true,
				inherit: false,
				notify: true
			});
		};
	});
})
.controller('newuserCtrl', function ($scope, $http, $state, $stateParams){
	$scope.username = $stateParams.username;
	$scope.newuser = {};
	$http.post('/:username/allusers/newuser', $scope.newuser).then(function (response){
		if (response.status == 201) {
			alert('Successfully create new user!');
			$state.go('adminIndex.users.all', {
				username: $scope.username
			});
		} else{
			alert(response);
		};
	});
})
.controller('settingCtrl', function ($scope, $state, $stateParams){
	$scope.username = $stateParams.username;
	$state.go('adminIndex.settings.pi', {
		username: $scope.username
	});
})
.controller('personalInfoCtrl', function ($scope, $http, $state, $stateParams){
	$http.get('/:username/userinfo').then(function (response){
		if (response.status == 200) {
			$scope.user = response.body;
		} else {
			alert("Error! Please try again.");
			$state.transitionTo($state.current, $stateParams, {
					reload: true,
					inherit: false,
					notify: true
				});
		};
	});
})
.controller('changePasswordCtrl', function ($scope, $location, User, Auth){
	$scope.errors = {};
	$scope.changePassword = function(form){
		$scope.submitted = true;
		if (form.$valid) {
			if ($scope.user.newPassword != $scope.confirmNewPassword) {
				$scope.errors.other = 'Two new passwords are different.';
			} else {
				Auth.changePassword($scope.user.oldPassword, $scope.user.newPassword)
				.then(function(){
					var message = 'Password successfully changed.';
					alert(message);
					$location.path('/login');
				}).catch(function(){
					form.password.$setValidity('mongoose', false);
					$scope.errors.other = 'Incorrect password';
				});
			};
		};
	};
})
.controller('settingsCtrl', function ($scope, settings){
	settings.loadAndWatch();
	$scope.themes = settings.availableThemes();
	$scope.setTheme = settings.setTheme;
});
