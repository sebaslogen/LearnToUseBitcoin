function DemoCtrl ($scope) {
  $scope.showDemo = function() {
    $('#show-demo').fadeOut("slow", function() {
      $('#show-demo').replaceWith($("#demo-content").fadeIn("slow"));
      $('div#start').height(parseInt($('#demo-content').height()) + 100); // Fix section's height
    });
  }
}