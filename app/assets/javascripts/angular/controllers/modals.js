ltubApp.controller('ModalsCtrl', ['$scope', function($scope) {
  
  $scope.showMinningInfo = function() {
    $('#minning-info-modal').foundation('reveal', 'open');
    analytics.track('Click Show Minning information');
  }
}]);