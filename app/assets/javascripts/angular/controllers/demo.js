ltubApp.controller('DemoCtrl', ['$scope', function($scope) {
  $scope.showDemo = function() {
    $('#show-demo').fadeOut("slow", function() {
      $('#show-demo').replaceWith($("#demo-content").fadeIn("slow"));
      updateSizes();
      moveToSection('#demo-content');
      $('#transference-demo').addClass('available');
    });
  }
}]);