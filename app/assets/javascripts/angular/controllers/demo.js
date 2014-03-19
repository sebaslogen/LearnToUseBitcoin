function DemoCtrl ($scope) {
  $scope.showDemo = function() {
    $('#show-demo').fadeOut("slow", function() {
      $('#show-demo').replaceWith($("#demo-content").fadeIn("slow"));
      updateSizes();
    });
  }
}