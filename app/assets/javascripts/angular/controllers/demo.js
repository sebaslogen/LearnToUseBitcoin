ltubApp.controller('DemoCtrl', ['$scope', function($scope) {
  $scope.showDemo = function() {
    $('#show-demo').fadeOut("slow", function() {
      $('div.sStart').height('100%'); // Change from fixed to auto adjust height after load
      $('#show-demo').replaceWith($("#demo-content").fadeIn("slow"));
      updateSizes();
      moveTo('#demo-content');
      $('#transference-demo').addClass('available');
    });
  }
}]);