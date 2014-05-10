ltubApp.controller('DemoCtrl', ['$scope', function($scope) {
  $scope.showDemo = function() {
    if ( $("#demo-content").hasClass('empty-content') ) {
      loadDemoContent(); // Load immediately if requested earlier than expected
    }
    $('#show-demo').fadeOut("slow", function() {
      $('div.sStart').height('100%'); // Change from fixed to auto adjust height after load
      $('#show-demo').replaceWith($("#demo-content").fadeIn("slow"));
      updateSizes();
      moveTo('#demo-content');
      $('#transference-demo').addClass('available');
      analytics.track('Click Discover Bitcoin', {
        small: (getWindowsSize() == "small"),
        language: I18n.locale
      });
    });
  }
}]);