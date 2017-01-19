'use strict';

angular.module('client').controller('dashboardController', function ($scope, $state, $stateParams){
	$scope.username = $stateParams.username;
	$state.go('userIndex.dashboard.all', {
		username: $scope.username
	});
})
.controller('allPController', function ($scope, $http, $state, $stateParams){
	// // DashboardController.$inject = ['$scope'];
	// function DashboardController($scope) {
	$scope.username = $stateParams.username;
    $http.get('/:username/dashboard').then(function (response){
      	if (response.status == 200) {
      		$scope.things = response.body;
      		for(var i = 1; i<= $scope.things.length; i++){
      			$scope.things[i-1].num = i;
      		};
      	} else {
      		$scope.message = response.status + response.body;
      	};
    });
})
.controller('showOneCtrl', function ($scope, $http, $state, $stateParams){
	$scope.username = $stateParams.username;
	//$scope.singlePost = {};
	$http.get('/:username/dashboard/:id').then(function (response){
		if (response.statusCode == 200) {
			$scope.singlePost = response.body;
			if ($scope.singlePost.tag === 'word') {
				$scope.showWord = true;
			} else{
				$scope.showWord =false;
				$scope.sentence = $singlePost.contents;
			};
		} else if (response.status == 500) {
			alert('Something wrong with the sever, please try again!');
		} else {
			alert('Sorry, Post not found.');
		};
	});
	$scope.addWord = function (item){
		$http.post('/:username/dashboard/:id', item).then(function (response){
			if (response.status == 201) {
				alert('Add to words successfully!');				
			} else if(response.status == 500) {
				alert('Something wrong with server, please try again.');
			} else {
				alert(response.message);
			};
		});
	};

	$scope.addSentence = function (sentence){
		$http.post('/:username/dashboard/:id', sentence).then(function (response){
			if (response.status == 201) {
				alert('Add to My Sentences successfully!');				
			} else if(response.status == 500) {
				alert('Something wrong with server, please try again.');
			} else {
				alert(response.message);
			};
		});
	};
})
.controller('wordCtrl', function ($state, $stateParams, $scope){
	$scope.username = $stateParams.username;
	$state.go('userIndex.cw.all', {
		username: $scope.username
	});
})
.controller('word1Ctrl', function ($scope, $http, $state, $stateParams, confirmService){
	$scope.username = $stateParams.username;
	$http.get('/:username/words').then(function (response){
		if (response.status == 200) {
			$scope.words = response.body;
			//$scope.message = "Wow! Let's see yout learing outcomes!";
			$scope.some = true;
			for(var i = 1; i <=$scope.words.length; i++){
				$scope.words[i-1].num = i;
				$scope.words[i-1].checked = false;
			};
		} else if (response.status == 500) {
			$scope.message = "Something Wrong with server, please try again.";
			$state.transitionTo($state.current, $stateParams, {
				reload: true,
				inherit: false,
				notify: true
			});
		} else {
			$scope.message = response.message;
			$scope.some = false;
		};
	});
	$scope.remove= function(){
		var dw = [];
		$scope.words.forEach(function (item){
			if (item.checked) {
				dw.push(item);
			};
		});
		if (!dw) {
			alert('Please select words to delete!');
		} else{
			if (confirmService.showPopup('Are you sure to delete selected words?')) {
				var errMessage = "";
				var fw = "";
				var sw = "";
				$scope.words.forEach(function (item){	
					if (item.checked) {
						$http.delete('/:username/words', {params: {id: item._id}}).then(function (response){
							if (response.status == 404) {
								fw += item.word + "/n";
							} else if (response.status == 500) {
								errMessage = "Something Wrong with server, please try again.";
							} else {
								sw += item.word;
							};
						});
					};
				});
			}
		};		
		if (fw) {
			alert("Fail to find the words: /n" + fw);
			$state.transitionTo($state.current, $stateParams, {
				reload: true,
				inherit: false,
				notify: true
			});
		} else if (errMessage) {
			alert(errMessage);
		} else {
			alert("Success to delete selected words.");
			$state.transitionTo($state.current, $stateParams, {
				reload: true,
				inherit: false,
				notify: true
			});
		};
	};
	$scope.reset = function(){
		$scope.words.forEach(function (item){
			item.checked = false;
		});
	};
})
.controller('oneWordCtrl', function ($scope, $http, $state, $stateParams, confirmService){
	$scope.username = $stateParams.username;
	$scope.singleWord = {};
	$http.get('/:username/words/:id').then(function (response){
		if (response.status == 200) {
			$scope.singleWord = response.body;
			$scope.word = $scope.singleWord;
		} else if (response.status == 500) {
			alert('Something wrong with the sever, please try again!');
			$state.go('userIndex.cw', {
					username: $scope.username
				});
		} else {
			alert('Sorry, fail to find the word.');
			$state.go('userIndex.cw', {
					username: $scope.username
				});
		};
	});
	$scope.remove = function (){
		if (confirmService.showPopup('Really delete this item?')) {
			$http.delete('/:username/words/:id',$scope.singleWord).then(function (response){
				if (response.status == 404 || response.status == 500) {
					alert('Sorry, fail to delete the word due to failure with server or word not found.');
				} else {
					alert('Successfully delete the word.');
					$state.go('userIndex.cw', {
						username: $scope.username
					});
				};
			});
		};
	};
})
.controller('editwordCtrl', function ($scope, $http, $state, $stateParams){
	$scope.username = $stateParams.username;
	$http.get('/:username/words/:id/edit').then(function (response){
		if (response.status == 200) {
			$scope.singleWord = response.body;
			$scope.word = $scope.singleWord;
		} else if (response.status == 500) {
			alert('Something wrong with the sever, please try again!');
			$state.go('userIndex.cw', {
					username: $scope.username
				});
		} else {
			alert('Sorry, fail to find the word.');
			$state.go('userIndex.cw', {
					username: $scope.username
				});
		};
	});
	$scope.updateWord = function (){
		if ($scope.ad) {
			$scope.word.atts.push($scope.ad);
		};
		$http.post('/:username/words/:id/edit', $scope.word).then(function (response){
			if (response.status == 200) {
				$scope.word = $scope.singleWord;
				alert('Update successfully!');
				$state.go('userIndex.cw.showOne', {
					username: $scope.username,
					id: $scope.word.id
				})
			} else if (response.status == 404) {
				alert("Sorry, fail to find the word.");
			} else {
				alert("Something wrong with server, please try again.");
			};
		});
	};
})
.controller('newwordCtrl', function ($scope, $http, $state, $stateParams){
	$scope.username = $stateParams.username;
	$scope.nw = {};
	var am = [];

	$scope.more = function(){
		am.push($scope.att);
		$scope.att = "";
	};
	$scope.nw.atts = am;

	$scope.addnewWord = function(item){
		$http.post('/:username/words/newword', item).then(function (response){
			if (response.status == 201) {
				alert("Successfully add a new word!");
				$state.go('userIndex.cw', {
					username: $scope.username
				});
			} else if (response.status == 500) {
				alert("Something wrong with server, please try again.");
			} else {
				alert(response.message);
			};
		});
	};
})
.controller('sentenceCtrl', function ($scope, $state, $stateParams){
	$scope.username = $stateParams.username;
	$state.go('userIndex.cs.all', {
		username: $scope.username,
	});
})
.controller('sentence1Ctrl', function ($scope, $http, $state, $stateParams, confirmService){
	$scope.username = $stateParams.username;
	$scope.sentences = {};
	$http.get('/:username/sentences').then(function (response){
		if (response.status == 200) {
			$scope.sentences = response.body;
			//$scope.message = "Wow! Let's see yout learing outcomes!";
			$scope.some = true;
			for (var j = 1; j<=$scope.sentences.length; j++) {
				// $scope.sentences[j-1].num = j;
				$scope.sentences[j-1].checked = false;
			};
		} else if (response.status == 500) {
			$scope.message = "Something Wrong with server, please try again.";	
			$state.transitionTo($state.current, $stateParams, {
					reload: true,
					inherit: false,
					notify: true
				});
			// $scope.some = false;
		} else {
			//$scope.message = response.message;
			$scope.some = false;
		};
	});
	// $scope.nd = true;
	$scope.remove= function(){
		var ds = [];
		$scope.sentences.forEach(function (item){
			if (item.checked) {
				ds.push(item)
			};
		});
		if (!ds) {
			alert("Please select items to delete!");
		}else{
			if (confirmService.showPopup('Are you sure to delete the selected items?')) {
				$scope.sentences.forEach(function (item){
					var errMessage = "";
					var fse = "";
					if (item.checked) {
						$http.delete('/:username/sentences', {params: {id: item._id}}).then(function (response){
							if (response.status == 404) {
								fse += item.sentence + "/n";
							} else if (response.status == 500) {
								errMessage = "Something Wrong with server, please try again.";
							};
						});
					};
				});
			};
		};
		
		if (fse) {
			alert("Fail to find the sentences: /n" + fse);
			$state.transitionTo($state.current, $stateParams, {
				reload: true,
				inherit: false,
				notify: true
			});
		} else if (errMessage) {
			alert(errMessage);
		} else {
			alert("Success to delete selected sentences.");
			$state.transitionTo($state.current, $stateParams, {
				reload: true,
				inherit: false,
				notify: true
			});
		};
	};
	$scope.reset = function(){
		$scope.sentences.forEach(function (item){
			item.checked = false;
		});
	};		
})
.controller('oneSentenceCtrl', function ($scope, $http, $state, $stateParams, confirmService){
	$scope.username = $stateParams.username;
	$scope.notes=[];
	$scope.newno = false;
	$http.get('/:username/sentences/:id').then(function (response){
		if (response.status == 200) {
			$scope.singleSentence = response.body;
		} else if (response.status == 500) {
			alert('Something wrong with the sever, please try again!');
			$state.go('userIndex.cs', {
					username: $scope.username
				});
		} else {
			alert('Sorry, fail to find the sentence.');
			$state.go('userIndex.cs', {
					username: $scope.username
				});
		};
	});
	$scope.notes=$scope.singleSentence.notes;
	
	$scope.saveNote = function(){
		var newnote = {};
		newnote.contents = $scope.note;
		newnote.date = new Date();
		$scope.notes.push(newnote);
		newnote = {};
		$scope.singleSentence.notes = $scope.notes;
		$http.post('/:username/sentenses/:id', $scope.singleSentence).then(function (response){
			if (response.status == 200) {
				$scope.singleSentence = response.body;
				$scope.note = "";
				$scope.sentence = $scope.singleSentence;
				alert("Successfully save note.");
			} else if (response.status == 404) {
				alert("Sorry, fail to find the sentence.");
			} else {
				alert("Something wrong with server, please try again.");
			};
		});
		$scope.newno = false;
	};
	$scope.remove = function(){
		if (confirmService.showPopup('Are you sure to delete the setence?')) {
			$http.delete('/:username/sentences/:id', $scope.singleSentence).then(function (response){
				if (response.status == 404 || response.status == 500) {
					alert('Sorry, fail to delete the sentence due to server error. Please try again.');
				} else {
					alert('Successfully delete the sentence.');
					$state.go('userIndex.cs', {
						username: $scope.username
					});
				};
			});
		};
	};
})
.controller('editsentenceCtrl', function ($scope, $state, $stateParams, $http){
	$scope.username = $stateParams.username;
	$http.get('/:username/sentences/:id/edit').then(function (response){
		if (response.status == 200) {
			$scope.singleSentence = response.body;
		} else if (response.status == 500) {
			alert('Something wrong with the sever, please try again!');
			$state.go('userIndex.cs', {
					username: $scope.username
				});
		} else {
			alert('Sorry, fail to find the sentence.');
			$state.go('userIndex.cs', {
					username: $scope.username
				});
		};
	});
	$scope.updateSentence = function (){
		$http.post('/:username/sentences/:id/edit', $scope.singleSentence).then(function (response){
			if (response.status == 200) {
				$scope.singleSentence = response.body;
				alert('Update successfully!');
				$state.go('userIndex.cs.showOne', {
					username: $scope.username,
					id: $scope.singleSentence.id
				});
			} else if (response.status == 404) {
				alert("Sorry, fail to find the sentence.");
			} else {
				alert("Something wrong with server, please try again.");
			};
		});
	};
})
.controller('newSentenceCtrl', function ($scope, $state, $stateParams, $http){
	$scope.username = $stateParams.username;
	$scope.ns = {};
	$scope.ns.notes = [];
	
	$scope.save = function(){
		var nnote = {};
		nnote.contents = $scope.note;
		nnote.date = new Date().toString();
		$scope.ns.notes.push(nnote);
		$scope.note = "";
	};

	$scope.create = function(item){
		$http.post('/:username/sentences/newsentence', item).then(function (response){
			if (response.status == 201) {
				alert("Successfully add a new sentence!");
				$state.go('userIndex.cs', {
					username: $scope.username
				});
			} else if (response.status == 500) {
				alert("Something wrong with server, please try again.");
			} else {
				alert(response.message);
			};
		});
	};
})
.controller('settingCtrl', function ($scope, $state, $stateParams){
	$scope.username = $stateParams.username;
	$state.go('userIndex.settings.pi', {
		username: $scope.username
	});
})
.controller('personalInfoCtrl', function ($scope, $http, $state, $stateParams){
	$http.get('/:username/userInfo').then(function (response){
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
    

