angular.module('application', [
    'ui.scroll',
    'ui.scroll.jqlite',
    'ngAnimate'
  ])
  .controller('mainController', [
    '$scope',
    '$log',
    '$timeout',
    function ($scope, console, $timeout) {
      var datasource, idList;

      // datasource implementation
      datasource = {};

      datasource.get = function (index, count, success) {
        return $timeout(function () {
          var i, item, j, ref, ref1, result;
          result = [];
          for (i = j = ref = index, ref1 = index + count - 1; ref <= ref1 ? j <= ref1 : j >= ref1; i = ref <= ref1 ? ++j : --j) {
            if (i <= 0 || i > 14) {
              continue;
            }
            item = {};
            item.id = i;
            item.content = "item #" + i;
            result.push(item);
          }
          return success(result);
        }, 100);
      };

      $scope.datasource = datasource;

      // adapter implementation
      $scope.adapterContainer = {
        adapter: {
          remain: true
        }
      };

      $scope.updateList = function () {
        return $scope.adapterContainer.adapter.applyUpdates(function (item, scope) {
          return item.content += ' *';
        });
      };

      $scope.removeFromList = function () {
        return $scope.adapterContainer.adapter.applyUpdates(function (item, scope) {
          if (scope.$index % 2 === 0) {
            return [];
          }
        });
      };

      $scope.refresh = function () {
        return $scope.adapterContainer.adapter.reload();
      };

      idList = 1000;

      return $scope.addToList = function () {
        return $scope.adapterContainer.adapter.applyUpdates(function (item, scope) {
          var newItem;
          newItem = void 0;
          if (scope.$index === 2) {
            newItem = {
              id: idList,
              content: 'a new one #' + idList
            };
            idList++;
            return [
              item,
              newItem
            ];
          }
        });
      };
    }
  ]);


/*
 //# sourceURL=src/animation.js
 */
