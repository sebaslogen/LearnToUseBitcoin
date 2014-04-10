ltubApp.controller('ModalsCtrl', ['$scope', function($scope) {
  
  $scope.showMiningInfo = function() {
    $('#mining-info-modal').foundation('reveal', 'open');
    analytics.track('Click Show Mining information');
  }
}]);