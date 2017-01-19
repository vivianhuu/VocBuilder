'use strict';
angular.module('client').directive('uiSidebar', ['$rootScope', '$window', '$timeout', 'MEDIA_QUERY', function ($rootScope, $window, $timeout, MEDIA_QUERY){
	return {
		restrict: 'A',
		link: function(scope, element){
			element.find('a').on('click', function (event){
				var ele = angular.element(this),
				    par = ele.parent()[0];

				var lis = ele.parent().parent().children();
				angular.forEach(lis, function (li){
					if (li != par) {
						angular.element(li).removeClass('active');
					};
				});

				var next = ele.next();
				if (next.length && next[0].tagName === 'UL') {
					ele.parent().toggleClass('active');
					event.preventDefault();
				};
			});

			if (onMobile()) {
				$timeout(function(){
					$rootScope.app.sidebar.isOffscreen = true;
				});
			};

			$rootScope.$on('$stateChangeStart', function(){
				if (onMobile()) {
					$rootScope.app.sidebar.isOffscreen = true;
				};
			});

			$window.addEventListener('resize', function(){
				$timeout(function(){
					$rootScope.app.sidebar.isOffscreen = onMobile();
				});
			});

			function onMobile(){
				return $window.innerWidth < MEDIA_QUERY.tablet;
			}
		}
	};
}])
.directive('ripple', ['$timeout', function ($timeout){
	return {
		restrict: 'A',
		link: function(scope, element, attrs){
			var x, y, size, offsets;
			element.append('<span class="ripple"></span>');
			element.on('click touchstart', function (e){
				var eventType = e.type;
				var rippleContainer = this.querySelector('.ripple');
				var ripple = rippleContainer.querySelector('.angular-ripple');
				if (ripple === null) {
					ripple = document.createElement('span');
					ripple.className = 'angular-ripple';
					rippleContainer.insertBefore(ripple, rippleContainer.firstChild);
					if (!ripple.offsetHeight && ! ripple.offsetWidth) {
						size = Math.max(rippleContainer.offsetWidth, rippleContainer.offsetHeight);
						ripple.style.width = size + 'px';
						ripple.style.height = size + 'px';
					};
				};

				var $ripple = angular.element(ripple);
				$ripple.removeClass('animate');
				if (eventType === 'click') {
					x = e.pageX;
					y = e.pageY;
				} else if (eventType === 'touchstart') {
					x = e.changedTouches[0].pageX;
					y = e.changedTouches[0].pageY;
				};

				function getPos(el){
					for (var lx=0, ly=0; el !==null; lx += el.offsetLeft, ly += el.offsetTop, el = el.offsetParent){
						return {left: lx, top: ly};
					};
				};

				offsets = offset($ripple.parent()[0]);
				ripple.style.left = (x - offsets.left - size / 2) + 'px';
				ripple.style.top = (y - offsets.top - size / 2) + 'px';
				$ripple.addClass('animate');
				$timeout(function(){
					$ripple.removeClass('animate');
				}, 500);
			});
		}
	};

	function offset(el){
		var rect = el.getBoundingClientRect();
		return {
			top: rect.top + document.body.scrollTop,
			left: rect.left + document.body.scrollLeft
		};
	};
}]);